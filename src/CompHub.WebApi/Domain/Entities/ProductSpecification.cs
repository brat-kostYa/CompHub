namespace CompHub.WebApi.Domain.Entities
{
    /// <summary>
    /// The actual specification value for a specific product.
    /// Example: Product "Ryzen 5 7600X" → SpecKey "Cores" → Value "6"
    /// </summary>
    public class ProductSpecification
    {
        public int Id { get; set; }
        public string Value { get; set; } = string.Empty;  // always stored as string

        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public int SpecificationKeyId { get; set; }
        public SpecificationKey SpecificationKey { get; set; } = null!;
    }
}
