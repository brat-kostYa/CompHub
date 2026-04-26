using CompHub.WebApi.Application.DTO;
using CompHub.WebApi.Application.DTO.QueryParams;
using Microsoft.EntityFrameworkCore;

namespace CompHub.WebApi.Infrastructure.Data.Repositories
{
    /// <summary>
    /// Encapsulates the complex filtered product query that would pollute the service layer.
    /// Projects directly to ProductListItemDto to avoid over-fetching.
    /// Simple CRUD operations remain directly in ProductService via AppDbContext.
    /// </summary>
    public class ProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(List<ProductListItemDto> Items, int TotalCount)> GetFilteredAsync(
            ProductFilterParams filter,
            CancellationToken cancellationToken = default)
        {
            var query = _context.Products
                .AsNoTracking()
                .Where(p => p.IsActive)
                .AsQueryable();

            if (filter.CategoryId.HasValue)
                query = query.Where(p =>
                    p.CategoryId == filter.CategoryId.Value ||
                    p.Category.ParentCategoryId == filter.CategoryId.Value);

            if (filter.BrandIds is { Count: > 0 })
                query = query.Where(p => filter.BrandIds.Contains(p.BrandId));

            if (filter.MinPrice.HasValue)
                query = query.Where(p => p.Price >= filter.MinPrice.Value);

            if (filter.MaxPrice.HasValue)
                query = query.Where(p => p.Price <= filter.MaxPrice.Value);

            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
                query = query.Where(p => p.Name.Contains(filter.SearchTerm));

            if (filter.InStock is true)
                query = query.Where(p => p.StockQuantity > 0);

            if (filter.Specifications is { Count: > 0 })
            {
                foreach (var (keyId, values) in filter.Specifications)
                {
                    query = query.Where(p =>
                        p.Specifications.Any(s =>
                            s.SpecificationKeyId == keyId &&
                            values.Contains(s.Value)));
                }
            }

            query = filter.SortBy switch
            {
                "price_asc" => query.OrderBy(p => p.Price),
                "price_desc" => query.OrderByDescending(p => p.Price),
                "name" => query.OrderBy(p => p.Name),
                _ => query.OrderByDescending(p => p.CreatedAt)
            };

            var totalCount = await query.CountAsync(cancellationToken);

            // Project to anonymous type first — Math.Round is not translatable in EF projection
            var raw = await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    CategoryName = p.Category.Name,
                    BrandName = p.Brand.Name,
                    ReviewCount = p.Reviews.Count(),
                    RawRating = (double?)p.Reviews.Average(r => (double?)r.Rating),
                })
                .ToListAsync(cancellationToken);

            var items = raw.Select(x => new ProductListItemDto(
                Id: x.Id,
                Name: x.Name,
                Price: x.Price,
                StockQuantity: x.StockQuantity,
                ImageUrl: x.ImageUrl,
                CategoryName: x.CategoryName,
                BrandName: x.BrandName,
                AverageRating: x.RawRating.HasValue ? Math.Round(x.RawRating.Value, 1) : null,
                ReviewCount: x.ReviewCount
            )).ToList();

            return (items, totalCount);
        }
    }
}