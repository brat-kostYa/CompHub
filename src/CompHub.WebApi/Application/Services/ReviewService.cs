using CompHub.WebApi.Application.DTO;
using CompHub.WebApi.Application.DTO.QueryParams;
using CompHub.WebApi.Application.DTO.Requests;
using CompHub.WebApi.Domain.Entities;
using CompHub.WebApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CompHub.WebApi.Application.Services
{
    /// <summary>
    /// Handles review creation and retrieval.
    /// </summary>
    public class ReviewService : IReviewService
    {
        private readonly AppDbContext _context;

        public ReviewService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<ReviewDto>> GetByProductIdAsync(
            int productId,
            ReviewQueryParams query,
            CancellationToken cancellationToken = default)
        {
            var baseQuery = _context.Reviews
                .AsNoTracking()
                .Where(r => r.ProductId == productId)
                .OrderByDescending(r => r.CreatedAt);

            var totalCount = await baseQuery.CountAsync(cancellationToken);

            var items = await baseQuery
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .Select(r => new ReviewDto(
                    r.Id,
                    r.Rating,
                    r.Comment,
                    r.CreatedAt,
                    r.User.FirstName + " " + r.User.LastName
                ))
                .ToListAsync(cancellationToken);

            return new PagedResult<ReviewDto>(
                Items: items,
                TotalCount: totalCount,
                PageNumber: query.Page,
                PageSize: query.PageSize,
                TotalPages: (int)Math.Ceiling((double)totalCount / query.PageSize)
            );
        }

        public async Task<ReviewDto> CreateAsync(
            int productId,
            int userId,
            CreateReviewRequest request,
            CancellationToken cancellationToken = default)
        {
            var productExists = await _context.Products
                .AnyAsync(p => p.Id == productId && p.IsActive, cancellationToken);

            if (!productExists)
                throw new KeyNotFoundException($"Product {productId} not found.");

            var alreadyReviewed = await _context.Reviews
                .AnyAsync(r => r.ProductId == productId && r.UserId == userId, cancellationToken);

            if (alreadyReviewed)
                throw new InvalidOperationException("You have already reviewed this product.");

            var review = new Review
            {
                ProductId = productId,
                UserId = userId,
                Rating = request.Rating,
                Comment = request.Comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync(cancellationToken);

            var userName = await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => u.FirstName + " " + u.LastName)
                .FirstAsync(cancellationToken);

            return new ReviewDto(
                review.Id,
                review.Rating,
                review.Comment,
                review.CreatedAt,
                userName
            );
        }
    }
}