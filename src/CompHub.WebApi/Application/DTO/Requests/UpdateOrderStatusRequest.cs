using System.ComponentModel.DataAnnotations;

namespace CompHub.WebApi.Application.DTO.Requests
{
    public record UpdateOrderStatusRequest(
        [Required] string Status
    );
}
