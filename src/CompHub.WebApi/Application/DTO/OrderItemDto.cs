namespace CompHub.WebApi.Application.DTO
{
    public record OrderItemDto(
        int ProductId,
        string ProductName,
        string? ProductImageUrl,
        int Quantity,
        decimal UnitPrice,
        decimal Subtotal
    );
}
