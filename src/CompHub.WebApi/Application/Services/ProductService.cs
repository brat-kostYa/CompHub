using CompHub.WebApi.Application.DTO;
using CompHub.WebApi.Application.DTO.QueryParams;
using CompHub.WebApi.Application.DTO.Requests;
using CompHub.WebApi.Domain.Entities;
using CompHub.WebApi.Infrastructure.Data;
using CompHub.WebApi.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CompHub.WebApi.Application.Services
{
    /// <summary>
    /// Handles product filtering, retrieval, and CRUD operations.
    /// </summary>
    public class ProductService : IProductService
    {
        private readonly ProductRepository _productRepository;
        private readonly AppDbContext _context;

        public ProductService(ProductRepository productRepository, AppDbContext context)
        {
            _productRepository = productRepository;
            _context = context;
        }

        /// <inheritdoc/>
        public async Task<PagedResult<ProductListItemDto>> GetFilteredAsync(
            ProductFilterParams filter,
            CancellationToken cancellationToken = default)
        {
            var (items, totalCount) = await _productRepository.GetFilteredAsync(filter, cancellationToken);

            return new PagedResult<ProductListItemDto>(
                Items: items,
                TotalCount: totalCount,
                PageNumber: filter.Page,
                PageSize: filter.PageSize,
                TotalPages: (int)Math.Ceiling((double)totalCount / filter.PageSize)
            );
        }

        /// <inheritdoc />
        public async Task<ProductDetailDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            // Splited query
            var product = await _context.Products
                .AsNoTracking()
                .AsSplitQuery()
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.Reviews)
                .Include(p => p.Specifications)
                    .ThenInclude(s => s.SpecificationKey)
                .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

            return product is null ? null : MapToDetail(product);
        }

        /// <inheritdoc />
        public async Task<ProductDetailDto> CreateAsync(
            CreateProductRequest request,
            CancellationToken cancellationToken = default)
        {
            var product = new Product
            {
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                StockQuantity = request.StockQuantity,
                ImageUrl = request.ImageUrl,
                CategoryId = request.CategoryId,
                BrandId = request.BrandId,
                CreatedAt = DateTime.UtcNow,
                Specifications = request.Specifications
                    .Select(s => new ProductSpecification
                    {
                        SpecificationKeyId = s.SpecificationKeyId,
                        Value = s.Value
                    })
                    .ToList()
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync(cancellationToken);

            // Перезавантажуємо з навігаційними властивостями для відповіді
            return (await GetByIdAsync(product.Id, cancellationToken))!;
        }

        /// <inheritdoc />
        public async Task<ProductDetailDto?> UpdateAsync(
            int id,
            UpdateProductRequest request,
            CancellationToken cancellationToken = default)
        {
            var product = await _context.Products
                .Include(p => p.Specifications)
                .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

            if (product is null) return null;

            product.Name = request.Name;
            product.Description = request.Description;
            product.Price = request.Price;
            product.StockQuantity = request.StockQuantity;
            product.IsActive = request.IsActive;
            product.ImageUrl = request.ImageUrl;
            product.CategoryId = request.CategoryId;
            product.BrandId = request.BrandId;

            // Замінюємо специфікації повністю
            _context.ProductSpecifications.RemoveRange(product.Specifications);
            product.Specifications = request.Specifications
                .Select(s => new ProductSpecification
                {
                    ProductId = id,
                    SpecificationKeyId = s.SpecificationKeyId,
                    Value = s.Value
                })
                .ToList();

            await _context.SaveChangesAsync(cancellationToken);

            return await GetByIdAsync(id, cancellationToken);
        }

        /// <inheritdoc />
        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var product = await _context.Products.FindAsync([id], cancellationToken);
            if (product is null) return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }

        /// <summary>
        /// Maps fully-loaded <see cref="Product"/> entity to <see cref="ProductDetailDto"/>.
        private static ProductDetailDto MapToDetail(Product p) => new(
            Id: p.Id,
            Name: p.Name,
            Description: p.Description,
            Price: p.Price,
            StockQuantity: p.StockQuantity,
            IsActive: p.IsActive,
            ImageUrl: p.ImageUrl,
            CreatedAt: p.CreatedAt,
            CategoryId: p.CategoryId,
            CategoryName: p.Category.Name,
            BrandId: p.BrandId,
            BrandName: p.Brand.Name,
            BrandLogoUrl: p.Brand.LogoUrl, 
            Specifications: p.Specifications
                .OrderBy(s => s.SpecificationKey.DisplayOrder)
                .Select(s => new SpecificationDto(
                    Key: s.SpecificationKey.Name,
                    Unit: s.SpecificationKey.Unit,
                    Value: s.Value,
                    DisplayOrder: s.SpecificationKey.DisplayOrder
                ))
                .ToList(),
            AverageRating: p.Reviews.Count > 0
                ? Math.Round(p.Reviews.Average(r => r.Rating), 1)
                : null,
            ReviewCount: p.Reviews.Count
        );
    }
}
