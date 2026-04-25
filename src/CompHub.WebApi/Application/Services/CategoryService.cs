using CompHub.WebApi.Application.DTO;
using CompHub.WebApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CompHub.WebApi.Application.Services
{
    /// <summary>
    /// Handles category read operations including specification key resolution.
    /// </summary>
    public class CategoryService : ICategoryService
    {
        private readonly AppDbContext _context;

        public CategoryService(AppDbContext context)
        {
            _context = context;
        }

        /// <inheritdoc />
        public async Task<List<CategoryDto>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            var categories = await _context.Categories
                .AsNoTracking()
                .Include(c => c.SubCategories)
                .Where(c => c.ParentCategoryId == null)
                .OrderBy(c => c.Name)
                .ToListAsync(cancellationToken);

            return categories.Select(MapToDto).ToList();
        }

        /// <inheritdoc />
        public async Task<CategoryWithSpecKeysDto?> GetWithSpecKeysAsync(
            int id,
            CancellationToken cancellationToken = default)
        {
            var category = await _context.Categories
                .AsNoTracking()
                .Include(c => c.SpecificationKeys)
                .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

            if (category is null) return null;

            return new CategoryWithSpecKeysDto(
                Id: category.Id,
                Name: category.Name,
                Slug: category.Slug,
                SpecificationKeys: category.SpecificationKeys
                    .OrderBy(k => k.DisplayOrder)
                    .Select(k => new SpecificationKeyDto(k.Id, k.Name, k.Unit, k.DisplayOrder))
                    .ToList()
            );
        }

        /// <inheritdoc/>
        public async Task<List<BrandDto>> GetBrandsByCategoryAsync(
            int categoryId,
            CancellationToken cancellationToken = default)
        {
            return await _context.Products
                .AsNoTracking()
                .Where(p => p.IsActive &&
                    (p.CategoryId == categoryId || p.Category.ParentCategoryId == categoryId))
                .Select(p => p.Brand)
                .Distinct()
                .OrderBy(b => b.Name)
                .Select(b => new BrandDto(b.Id, b.Name, b.LogoUrl))
                .ToListAsync(cancellationToken);
        }

        private static CategoryDto MapToDto(Domain.Entities.Category c) => new(
            Id: c.Id,
            Name: c.Name,
            Slug: c.Slug,
            ParentCategoryId: c.ParentCategoryId,
            SubCategories: c.SubCategories.Select(MapToDto).ToList()
        );
    }
}
