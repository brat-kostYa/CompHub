using System.ComponentModel.DataAnnotations;

namespace CompHub.WebApi.Application.DTO.Requests
{
    public record CreateReviewRequest(
        [Range(1, 5)] int Rating,
        [MaxLength(2000)] string? Comment
    );
}
