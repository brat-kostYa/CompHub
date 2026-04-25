using CompHub.WebApi.Application.DTO;
using CompHub.WebApi.Application.DTO.QueryParams;
using CompHub.WebApi.Application.DTO.Requests;

namespace CompHub.WebApi.Application.Services
{
    /// <summary>
    /// Defines product CRUD and filtering operations.
    /// </summary>
    public interface IProductService
    {
        /// <summary>
        /// Returns a paginated and filtered list of products.
        /// </summary>
        Task<PagedResult<ProductListItemDto>> GetFilteredAsync(
            ProductFilterParams filter,
            CancellationToken cancellationToken = default);

        /// <summary>
        /// Returns full product details by id, or null if not found.
        /// </summary>
        Task<ProductDetailDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

        /// <summary>
        /// Creates a new product and returns its detail representation.
        /// </summary>
        Task<ProductDetailDto> CreateAsync(
            CreateProductRequest request,
            CancellationToken cancellationToken = default);

        /// <summary>
        /// Updates an existing product. Returns null if not found.
        /// </summary>
        Task<ProductDetailDto?> UpdateAsync(
            int id,
            UpdateProductRequest request,
            CancellationToken cancellationToken = default);

        /// <summary>
        /// Deletes a product. Returns false if not found.
        /// </summary>
        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
    }
}
