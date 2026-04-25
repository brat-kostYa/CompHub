namespace CompHub.WebApi.Application.DTO
{
    public record CategoryDto(
        int Id,
        string Name,
        string? Slug,
        int? ParentCategoryId,
        List<CategoryDto> SubCategories
    );
}
