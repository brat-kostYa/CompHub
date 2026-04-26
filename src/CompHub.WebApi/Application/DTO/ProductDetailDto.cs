namespace CompHub.WebApi.Application.DTO
{
    public record ProductDetailDto(
        int Id,
        string Name,
        string? Description,
        decimal Price,
        int StockQuantity,
        bool IsActive,
        string? ImageUrl,
        DateTime CreatedAt,
        int CategoryId,
        string CategoryName,
        int BrandId,
        string BrandName,
        string? BrandLogoUrl,
        List<SpecificationDto> Specifications,
        double? AverageRating,
        int ReviewCount
    );
}
