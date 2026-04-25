using System.ComponentModel.DataAnnotations;

namespace CompHub.WebApi.Domain.Entities
{
    public class Review
    {
        public int Id { get; set; }
        public int Rating { get; set; }  // 1–5 stars
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
