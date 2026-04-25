using System.ComponentModel.DataAnnotations;

namespace CompHub.WebApi.Application.DTO.Requests
{
    public record UpdateProductRequest(
        [Required, MaxLength(200)] string Name,
        [MaxLength(4000)] string? Description,
        [Range(0, 10000000.00)] decimal Price,
        [Range(0, int.MaxValue)] int StockQuantity,
        bool IsActive,
        [MaxLength(500)] string? ImageUrl,
        [Range(1, int.MaxValue)] int CategoryId,
        [Range(1, int.MaxValue)] int BrandId,
        List<ProductSpecificationRequest> Specifications
    );
}
