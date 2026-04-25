using CompHub.WebApi.Application.DTO;
using CompHub.WebApi.Application.DTO.QueryParams;
using CompHub.WebApi.Application.DTO.Requests;

namespace CompHub.WebApi.Application.Services
{
    /// <summary>
    /// Defines review operations scoped to a product.
    /// </summary>
    public interface IReviewService
    {
        /// <summary>
        /// Returns a paginated list of reviews for a product.
        /// </summary>
        Task<PagedResult<ReviewDto>> GetByProductIdAsync(int productId, ReviewQueryParams query, CancellationToken cancellationToken = default);

        /// <summary>
        /// Creates a review. Throws <see cref="InvalidOperationException"/> if the user has already reviewed this product.
        /// Throws <see cref="KeyNotFoundException"/> if the product does not exist.
        /// </summary>
        Task<ReviewDto> CreateAsync(int productId, int userId, CreateReviewRequest request, CancellationToken cancellationToken = default);
    }
}
