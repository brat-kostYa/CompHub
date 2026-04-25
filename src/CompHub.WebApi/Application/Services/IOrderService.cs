using CompHub.WebApi.Application.DTO;
using CompHub.WebApi.Application.DTO.Requests;

namespace CompHub.WebApi.Application.Services
{
    /// <summary>
    /// Defines order placement and retrieval operations.
    /// </summary>
    public interface IOrderService
    {
        /// <summary>
        /// Returns all orders for the specified user.
        /// </summary>
        Task<List<OrderListItemDto>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Returns full order details. Returns null if not found or not owned by the user.
        /// </summary>
        Task<OrderDetailDto?> GetByIdAsync(int orderId, int userId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Places a new order. Throws <see cref="ArgumentException"/> if any product is invalid or out of stock.
        /// </summary>
        Task<OrderDetailDto> CreateAsync(int userId, CreateOrderRequest request, CancellationToken cancellationToken = default);

        /// <summary>
        /// Updates the status of an order. Throws <see cref="KeyNotFoundException"/> if not found.
        /// Throws <see cref="InvalidOperationException"/> if the status transition is not allowed.
        /// </summary>
        Task<OrderDetailDto> UpdateStatusAsync(int orderId, UpdateOrderStatusRequest request, CancellationToken cancellationToken = default);
    }
}
