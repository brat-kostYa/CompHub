namespace CompHub.WebApi.Domain.Entities
{
    public class Brand
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? LogoUrl { get; set; }

        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
