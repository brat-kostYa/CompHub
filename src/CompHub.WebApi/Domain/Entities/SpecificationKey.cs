namespace CompHub.WebApi.Domain.Entities
{
    /// <summary>
    /// Defines a specification type for a category.
    /// Example: Category "Processors" → Keys: "Socket", "Cores", "TDP"
    /// </summary>
    public class SpecificationKey
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;  // e.g. "Cores", "Clock Speed"
        public string? Unit { get; set; }                  // e.g. "GHz", "GB", "W"
        public int DisplayOrder { get; set; }

        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;

        public ICollection<ProductSpecification> ProductSpecifications { get; set; } = new List<ProductSpecification>();
    }
}
