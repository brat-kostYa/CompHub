using CompHub.WebApi.Application.DTO;
using CompHub.WebApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CompHub.WebApi.Application.Services
{
    /// <summary>
    /// Handles brand read operations.
    /// </summary>
    public class BrandService : IBrandService
    {
        private readonly AppDbContext _context;

        public BrandService(AppDbContext context)
        {
            _context = context;
        }

        /// <inheritdoc />
        public async Task<List<BrandDto>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await _context.Brands
                .AsNoTracking()
                .OrderBy(b => b.Name)
                .Select(b => new BrandDto(b.Id, b.Name, b.LogoUrl))
                .ToListAsync(cancellationToken);
        }
    }
}
