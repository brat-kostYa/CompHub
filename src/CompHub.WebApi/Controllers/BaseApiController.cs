using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CompHub.WebApi.Controllers
{
    /// <summary>
    /// Base controller providing access to the current authenticated user's id.
    /// </summary>
    [ApiController]
    public abstract class BaseApiController : ControllerBase
    {
        /// <summary>
        /// Returns the id of the currently authenticated user from JWT claims.
        /// </summary>
        protected int CurrentUserId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }
}
