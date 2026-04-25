using System.ComponentModel.DataAnnotations;

namespace CompHub.WebApi.Application.DTO.Requests
{
    public record LoginRequest(
        [Required, EmailAddress, MaxLength(256)] string Email,
        [Required] string Password
    );
}
