using CompHub.WebApi.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CompHub.WebApi.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Brand> Brands => Set<Brand>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<SpecificationKey> SpecificationKeys => Set<SpecificationKey>();
        public DbSet<ProductSpecification> ProductSpecifications => Set<ProductSpecification>();
        public DbSet<User> Users => Set<User>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();
        public DbSet<Review> Reviews => Set<Review>();

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // =============== Category ===============
            modelBuilder.Entity<Category>(e =>
            {
                e.HasKey(c => c.Id);
                e.Property(c => c.Name).HasMaxLength(100).IsRequired();
                e.Property(c => c.Slug).HasMaxLength(120);

                e.HasOne(c => c.ParentCategory)
                    .WithMany(c => c.SubCategories)
                    .HasForeignKey(c => c.ParentCategoryId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // =============== Brand ===============
            modelBuilder.Entity<Brand>(e =>
            {
                e.HasKey(b => b.Id);
                e.Property(b => b.Name).HasMaxLength(100).IsRequired();
                e.Property(b => b.LogoUrl).HasMaxLength(500);
            });

            // =============== Product ===============
            modelBuilder.Entity<Product>(e =>
            {
                e.HasKey(p => p.Id);
                e.Property(p => p.Name).HasMaxLength(200).IsRequired();
                e.Property(p => p.Description).HasMaxLength(4000);
                e.Property(p => p.Price).HasColumnType("decimal(18,2)").IsRequired();
                e.Property(p => p.ImageUrl).HasMaxLength(500);
                e.Property(p => p.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                e.HasOne(p => p.Category)
                    .WithMany(c => c.Products)
                    .HasForeignKey(p => p.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);

                e.HasOne(p => p.Brand)
                    .WithMany(b => b.Products)
                    .HasForeignKey(p => p.BrandId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // =============== SpecificationKey ===============
            modelBuilder.Entity<SpecificationKey>(e =>
            {
                e.HasKey(s => s.Id);
                e.Property(s => s.Name).HasMaxLength(100).IsRequired();
                e.Property(s => s.Unit).HasMaxLength(20);

                e.HasOne(s => s.Category)
                    .WithMany(c => c.SpecificationKeys)
                    .HasForeignKey(s => s.CategoryId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // =============== ProductSpecification ===============
            modelBuilder.Entity<ProductSpecification>(e =>
            {
                e.HasKey(ps => ps.Id);
                e.Property(ps => ps.Value).HasMaxLength(500).IsRequired();

                e.HasOne(ps => ps.Product)
                    .WithMany(p => p.Specifications)
                    .HasForeignKey(ps => ps.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(ps => ps.SpecificationKey)
                    .WithMany(sk => sk.ProductSpecifications)
                    .HasForeignKey(ps => ps.SpecificationKeyId)
                    .OnDelete(DeleteBehavior.Restrict);

                // A product should not have the same spec key twice
                e.HasIndex(ps => new { ps.ProductId, ps.SpecificationKeyId }).IsUnique();
            });

            // =============== User ===============
            modelBuilder.Entity<User>(e =>
            {
                e.HasKey(u => u.Id);
                e.Property(u => u.Email).HasMaxLength(256).IsRequired();
                e.HasIndex(u => u.Email).IsUnique();
                e.Property(u => u.PasswordHash).HasMaxLength(512).IsRequired();
                e.Property(u => u.FirstName).HasMaxLength(100).IsRequired();
                e.Property(u => u.LastName).HasMaxLength(100).IsRequired();
                e.Property(u => u.PhoneNumber).HasMaxLength(20);
                e.Property(u => u.Role).HasConversion<int>().HasDefaultValue(UserRole.Customer);
                e.Property(u => u.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            // =============== Order ===============
            modelBuilder.Entity<Order>(e =>
            {
                e.HasKey(o => o.Id);
                e.Property(o => o.TotalAmount).HasColumnType("decimal(18,2)").IsRequired();
                e.Property(o => o.ShippingAddress).HasMaxLength(300).IsRequired();
                e.Property(o => o.ShippingCity).HasMaxLength(100).IsRequired();
                e.Property(o => o.Status).HasConversion<int>();
                e.Property(o => o.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                e.HasOne(o => o.User)
                    .WithMany(u => u.Orders)
                    .HasForeignKey(o => o.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // =============== OrderItem ===============
            modelBuilder.Entity<OrderItem>(e =>
            {
                e.HasKey(oi => oi.Id);
                e.Property(oi => oi.UnitPrice).HasColumnType("decimal(18,2)").IsRequired();

                e.HasOne(oi => oi.Order)
                    .WithMany(o => o.Items)
                    .HasForeignKey(oi => oi.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(oi => oi.Product)
                    .WithMany(p => p.OrderItems)
                    .HasForeignKey(oi => oi.ProductId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // =============== Review ===============
            modelBuilder.Entity<Review>(e =>
            {
                e.HasKey(r => r.Id);
                e.Property(r => r.Rating).IsRequired();
                e.Property(r => r.Comment).HasMaxLength(2000);
                e.Property(o => o.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                e.HasOne(r => r.Product)
                    .WithMany(p => p.Reviews)
                    .HasForeignKey(r => r.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(r => r.User)
                    .WithMany(u => u.Reviews)
                    .HasForeignKey(r => r.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                // One review per user per product
                e.HasIndex(r => new { r.ProductId, r.UserId }).IsUnique();
            });
        }
    }
}
