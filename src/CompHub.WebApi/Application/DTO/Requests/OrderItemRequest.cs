using System.ComponentModel.DataAnnotations;

namespace CompHub.WebApi.Application.DTO.Requests
{
    public record OrderItemRequest(
        [Range(1, int.MaxValue)] int ProductId,
        [Range(1, int.MaxValue)] int Quantity
    );
}
