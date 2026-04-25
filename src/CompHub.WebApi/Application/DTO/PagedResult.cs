namespace CompHub.WebApi.Application.DTO
{
    public record PagedResult<T>(
        List<T> Items,
        int TotalCount,
        int PageNumber,
        int PageSize,
        int TotalPages
    );
}
