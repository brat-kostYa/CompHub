namespace CompHub.WebApi.Application.DTO
{
    public record SpecificationKeyDto(
        int Id,
        string Name,
        string? Unit,
        int DisplayOrder
    );
}
