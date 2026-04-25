using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CompHub.WebApi.Application.DTO;
using CompHub.WebApi.Application.DTO.Requests;
using CompHub.WebApi.Domain.Entities;
using CompHub.WebApi.Infrastructure.Auth;
using CompHub.WebApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace CompHub.WebApi.Application.Services
{
    /// <summary>
    /// Handles user registration, login, and JWT token generation.
    /// </summary>
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly JwtSettings _jwt;

        public AuthService(AppDbContext context, IOptions<JwtSettings> jwtOptions)
        {
            _context = context;
            _jwt = jwtOptions.Value;
        }

        public async Task<AuthTokenDto> RegisterAsync(
            RegisterRequest request,
            CancellationToken cancellationToken = default)
        {
            var email = request.Email.ToLowerInvariant();

            var exists = await _context.Users.AnyAsync(u => u.Email == email, cancellationToken);
            if (exists)
                throw new InvalidOperationException($"Email '{request.Email}' is already registered.");

            var user = new User
            {
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                FirstName = request.FirstName,
                LastName = request.LastName,
                PhoneNumber = request.PhoneNumber,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync(cancellationToken);

            return GenerateToken(user);
        }

        public async Task<AuthTokenDto?> LoginAsync(
            LoginRequest request,
            CancellationToken cancellationToken = default)
        {
            var email = request.Email.ToLowerInvariant();

            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);

            if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return null;

            return GenerateToken(user);
        }

        // =============== Private ===============

        private AuthTokenDto GenerateToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.SecretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expiresAt = DateTime.UtcNow.AddHours(_jwt.ExpiresInHours);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _jwt.Issuer,
                audience: _jwt.Audience,
                claims: claims,
                expires: expiresAt,
                signingCredentials: credentials
            );

            return new AuthTokenDto(
                AccessToken: new JwtSecurityTokenHandler().WriteToken(token),
                ExpiresAt: expiresAt,
                UserId: user.Id,
                Email: user.Email,
                FirstName: user.FirstName,
                LastName: user.LastName
            );
        }
    }
}
