using CompHub.WebApi.Application.Common;
using CompHub.WebApi.Application.DTO.QueryParams;
using CompHub.WebApi.Application.DTO.Requests;
using CompHub.WebApi.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CompHub.WebApi.Controllers
{
    [Route("api/products/{productId:int}/reviews")]
    public class ReviewsController : BaseApiController
    {
        private readonly IReviewService _reviewService;

        public ReviewsController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        /// <summary>
        /// Returns all reviews for a product.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetByProduct(
            int productId,
            [FromQuery] ReviewQueryParams query,
            CancellationToken cancellationToken)
        {
            var reviews = await _reviewService.GetByProductIdAsync(productId, query, cancellationToken);
            return Ok(ApiResponse<object>.SuccessResponse(reviews));
        }

        /// <summary>
        /// Creates a review for a product. One review per user per product.
        /// </summary>
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(
            int productId,
            [FromBody] CreateReviewRequest request,
            CancellationToken cancellationToken)
        {
            var review = await _reviewService.CreateAsync(productId, CurrentUserId, request, cancellationToken);
            return Ok(ApiResponse<object>.SuccessResponse(review, "Review submitted."));
        }
    }
}
