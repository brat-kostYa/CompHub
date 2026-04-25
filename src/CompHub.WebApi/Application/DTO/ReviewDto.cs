namespace CompHub.WebApi.Application.DTO
{
    public record ReviewDto(
        int Id,
        int Rating,
        string? Comment,
        DateTime CreatedAt,
        string UserFullName
    );
}
