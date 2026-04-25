namespace CompHub.WebApi.Application.DTO
{
    public record OrderListItemDto(
        int Id,
        DateTime CreatedAt,
        string Status,
        decimal TotalAmount,
        int ItemCount
    );
}
