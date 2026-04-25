namespace CompHub.WebApi.Application.DTO
{
    public record ProductListItemDto(
        int Id,
        string Name,
        decimal Price,
        int StockQuantity,
        string? ImageUrl,
        string CategoryName,
        string BrandName,
        double? AverageRating,
        int ReviewCount
    );
}
