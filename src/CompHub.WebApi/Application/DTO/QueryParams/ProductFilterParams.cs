using System.ComponentModel.DataAnnotations;

namespace CompHub.WebApi.Application.DTO.QueryParams
{
    /// <summary>
    /// Query parameters for filtering, sorting, and paginating the product list.
    /// All filtering and sorting is resolved server-side — pagination depends on it.
    /// </summary>
    public record ProductFilterParams
    {
        public int? CategoryId { get; init; }
        public List<int>? BrandIds { get; init; }
        public decimal? MinPrice { get; init; }
        public decimal? MaxPrice { get; init; }

        [MaxLength(100)]
        public string? SearchTerm { get; init; }

        public bool? InStock { get; init; }

        // Key = SpecificationKeyId, Value = list of allowed values
        // Bound from query: specifications[1]=LGA1700&specifications[1]=AM5
        public Dictionary<int, List<string>>? Specifications { get; init; }

        public string? SortBy { get; init; }  // "price_asc" | "price_desc" | "name" | "newest"

        [Range(1, int.MaxValue)]
        public int Page { get; init; } = 1;

        [Range(1, 100)]
        public int PageSize { get; init; } = 20;
    }
}
