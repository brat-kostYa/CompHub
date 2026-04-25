namespace CompHub.WebApi.Application.DTO
{
    public record CategoryWithSpecKeysDto(
        int Id,
        string Name,
        string? Slug,
        List<SpecificationKeyDto> SpecificationKeys
    );
}
