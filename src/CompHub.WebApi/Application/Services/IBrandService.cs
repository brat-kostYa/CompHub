using CompHub.WebApi.Application.DTO;

namespace CompHub.WebApi.Application.Services
{
    /// <summary>
    /// Defines brand-related read operations.
    /// </summary>
    public interface IBrandService
    {
        /// <summary>
        /// Returns all brands ordered by name.
        /// </summary>
        Task<List<BrandDto>> GetAllAsync(CancellationToken cancellationToken = default);
    }
}
