using CompHub.WebApi.Application.DTO;

namespace CompHub.WebApi.Application.Services
{
    /// <summary>
    /// Defines category-related read operations.
    /// </summary>
    public interface ICategoryService
    {
        /// <summary>
        /// Returns all top-level categories with their sub-categories.
        /// </summary>
        Task<List<CategoryDto>> GetAllAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Returns a single category with its specification keys, or null if not found.
        /// </summary>
        Task<CategoryWithSpecKeysDto?> GetWithSpecKeysAsync(int id, CancellationToken cancellationToken = default);

        /// <summary>
        /// Returns brands that have active products in the given category or its sub-categories.
        /// </summary>
        Task<List<BrandDto>> GetBrandsByCategoryAsync(int categoryId, CancellationToken cancellationToken = default);
    }
}
