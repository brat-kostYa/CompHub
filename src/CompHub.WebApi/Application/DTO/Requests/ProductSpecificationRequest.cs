using System.ComponentModel.DataAnnotations;

namespace CompHub.WebApi.Application.DTO.Requests
{
    public record ProductSpecificationRequest(
        [Range(1, int.MaxValue)] int SpecificationKeyId,
        [Required, MaxLength(500)] string Value
    );
}
