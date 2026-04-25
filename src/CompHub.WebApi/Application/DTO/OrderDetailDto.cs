namespace CompHub.WebApi.Application.DTO
{
    public record OrderDetailDto(
        int Id,
        DateTime CreatedAt,
        string Status,
        decimal TotalAmount,
        string ShippingAddress,
        string ShippingCity,
        List<OrderItemDto> Items
    );
}
