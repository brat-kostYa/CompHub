using System.ComponentModel.DataAnnotations;

namespace CompHub.WebApi.Application.DTO.QueryParams
{
    public record ReviewQueryParams
    {
        [Range(1, int.MaxValue)]
        public int Page { get; init; } = 1;
        [Range(1, 100)]
        public int PageSize { get; init; } = 10;
    }
}
