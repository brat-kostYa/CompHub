using CompHub.WebApi.Application.DTO;
using CompHub.WebApi.Application.DTO.Requests;

namespace CompHub.WebApi.Application.Services
{
    /// <summary>
    /// Defines user registration and authentication operations.
    /// </summary>
    public interface IAuthService
    {
        /// <summary>
        /// Registers a new user. Throws <see cref="InvalidOperationException"/> if email already exists.
        /// </summary>
        Task<AuthTokenDto> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default);

        /// <summary>
        /// Authenticates a user. Returns null if credentials are invalid.
        /// </summary>
        Task<AuthTokenDto?> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
    }
}
