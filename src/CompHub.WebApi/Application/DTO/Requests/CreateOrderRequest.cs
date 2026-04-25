using System.ComponentModel.DataAnnotations;

namespace CompHub.WebApi.Application.DTO.Requests
{
    public record CreateOrderRequest(
        [Required, MaxLength(300)] string ShippingAddress,
        [Required, MaxLength(100)] string ShippingCity,
        [Required, MinLength(1)] List<OrderItemRequest> Items
    );
}
