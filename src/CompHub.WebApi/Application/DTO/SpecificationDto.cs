namespace CompHub.WebApi.Application.DTO
{
    public record SpecificationDto(
        string Key,
        string? Unit,
        string Value,
        int DisplayOrder
    );
}
