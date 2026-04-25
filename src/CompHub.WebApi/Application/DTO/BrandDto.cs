namespace CompHub.WebApi.Application.DTO
{
    public record BrandDto(
        int Id,
        string Name,
        string? LogoUrl
    );
}
