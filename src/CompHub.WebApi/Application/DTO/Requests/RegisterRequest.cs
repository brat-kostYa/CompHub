using System.ComponentModel.DataAnnotations;

namespace CompHub.WebApi.Application.DTO.Requests
{
    public record RegisterRequest(
        [Required, MaxLength(100)] string FirstName,
        [Required, MaxLength(100)] string LastName,
        [Required, EmailAddress, MaxLength(256)] string Email,
        [Required, MinLength(6), MaxLength(100)] string Password,
        [MaxLength(20)] string? PhoneNumber
    );
}
