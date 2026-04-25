using CompHub.WebApi.Application.DTO;
using CompHub.WebApi.Application.DTO.Requests;
using CompHub.WebApi.Domain.Entities;
using CompHub.WebApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CompHub.WebApi.Application.Services
{
    /// <summary>
    /// Handles order placement and retrieval.
    /// TotalAmount is always calculated server-side from current product prices.
    /// </summary>
    public class OrderService : IOrderService
    {
        private readonly AppDbContext _context;

        public OrderService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<OrderListItemDto>> GetByUserIdAsync(
            int userId,
            CancellationToken cancellationToken = default)
        {
            return await _context.Orders
                .AsNoTracking()
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new OrderListItemDto(
                    o.Id,
                    o.CreatedAt,
                    o.Status.ToString(),
                    o.TotalAmount,
                    o.Items.Count
                ))
                .ToListAsync(cancellationToken);
        }

        public async Task<OrderDetailDto?> GetByIdAsync(
            int orderId,
            int userId,
            CancellationToken cancellationToken = default)
        {
            var order = await _context.Orders
                .AsNoTracking()
                .Include(o => o.Items)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId, cancellationToken);

            return order is null ? null : MapToDetail(order);
        }

        public async Task<OrderDetailDto> CreateAsync(
            int userId,
            CreateOrderRequest request,
            CancellationToken cancellationToken = default)
        {
            var productIds = request.Items.Select(i => i.ProductId).Distinct().ToList();

            var products = await _context.Products
                .Where(p => productIds.Contains(p.Id) && p.IsActive)
                .ToListAsync(cancellationToken);

            var missingIds = productIds.Except(products.Select(p => p.Id)).ToList();
            if (missingIds.Count > 0)
                throw new ArgumentException($"Products not found or inactive: {string.Join(", ", missingIds)}.");

            // Verify stock before touching anything
            var productMap = products.ToDictionary(p => p.Id);
            foreach (var item in request.Items)
            {
                var product = productMap[item.ProductId];
                if (product.StockQuantity < item.Quantity)
                    throw new ArgumentException(
                        $"Insufficient stock for product '{product.Name}'. " +
                        $"Available: {product.StockQuantity}, requested: {item.Quantity}.");
            }

            var orderItems = request.Items.Select(i => new OrderItem
            {
                ProductId = i.ProductId,
                Quantity = i.Quantity,
                UnitPrice = productMap[i.ProductId].Price
            }).ToList();

            // Decrement stock
            foreach (var item in request.Items)
                productMap[item.ProductId].StockQuantity -= item.Quantity;

            var order = new Order
            {
                UserId = userId,
                ShippingAddress = request.ShippingAddress,
                ShippingCity = request.ShippingCity,
                CreatedAt = DateTime.UtcNow,
                Status = OrderStatus.Pending,
                TotalAmount = orderItems.Sum(i => i.UnitPrice * i.Quantity),
                Items = orderItems
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync(cancellationToken);

            return (await GetByIdAsync(order.Id, userId, cancellationToken))!;
        }

        public async Task<OrderDetailDto> UpdateStatusAsync(
            int orderId,
            UpdateOrderStatusRequest request,
            CancellationToken cancellationToken = default)
        {
            if (!Enum.TryParse<OrderStatus>(request.Status, ignoreCase: true, out var newStatus))
                throw new ArgumentException($"Unknown order status: '{request.Status}'.");

            var order = await _context.Orders
                .Include(o => o.Items)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(o => o.Id == orderId, cancellationToken);

            if (order is null)
                throw new KeyNotFoundException($"Order {orderId} not found.");

            if (!_allowedTransitions[order.Status].Contains(newStatus))
                throw new InvalidOperationException(
                    $"Cannot transition order from '{order.Status}' to '{newStatus}'.");

            // Restore stock when cancelling
            if (newStatus == OrderStatus.Cancelled)
            {
                foreach (var item in order.Items)
                    item.Product.StockQuantity += item.Quantity;
            }

            order.Status = newStatus;
            await _context.SaveChangesAsync(cancellationToken);

            return (await GetByIdAsync(order.Id, order.UserId, cancellationToken))!;
        }

        // =============== Private ===============

        private static OrderDetailDto MapToDetail(Order o) => new(
            Id: o.Id,
            CreatedAt: o.CreatedAt,
            Status: o.Status.ToString(),
            TotalAmount: o.TotalAmount,
            ShippingAddress: o.ShippingAddress,
            ShippingCity: o.ShippingCity,
            Items: o.Items.Select(i => new OrderItemDto(
                ProductId: i.ProductId,
                ProductName: i.Product.Name,
                ProductImageUrl: i.Product.ImageUrl,
                Quantity: i.Quantity,
                UnitPrice: i.UnitPrice,
                Subtotal: i.UnitPrice * i.Quantity
            )).ToList()
        );

        // Valid status transitions
        private static readonly Dictionary<OrderStatus, IReadOnlyList<OrderStatus>> _allowedTransitions = new()
        {
            [OrderStatus.Pending] = [OrderStatus.Processing, OrderStatus.Cancelled],
            [OrderStatus.Processing] = [OrderStatus.Shipped, OrderStatus.Cancelled],
            [OrderStatus.Shipped] = [OrderStatus.Delivered, OrderStatus.Cancelled],
            [OrderStatus.Delivered] = [],
            [OrderStatus.Cancelled] = []
        };
    }
}
