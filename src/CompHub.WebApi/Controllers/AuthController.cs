using CompHub.WebApi.Application.Common;
using CompHub.WebApi.Application.DTO.Requests;
using CompHub.WebApi.Application.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace CompHub.WebApi.Controllers
{
    [ApiController]
    [Route("api/auth")]
    [EnableRateLimiting("auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Registers a new user and returns a JWT token.
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register(
            [FromBody] RegisterRequest request,
            CancellationToken cancellationToken)
        {
            var token = await _authService.RegisterAsync(request, cancellationToken);
            return Ok(ApiResponse<object>.SuccessResponse(token, "Registration successful."));
        }

        /// <summary>
        /// Authenticates a user and returns a JWT token.
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login(
            [FromBody] LoginRequest request,
            CancellationToken cancellationToken)
        {
            var token = await _authService.LoginAsync(request, cancellationToken);

            if (token is null)
                return Unauthorized(ApiResponse.ErrorResponse("Invalid email or password."));

            return Ok(ApiResponse<object>.SuccessResponse(token));
        }
    }
}
