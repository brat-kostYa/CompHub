using CompHub.WebApi.Application.Common;
using CompHub.WebApi.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CompHub.WebApi.Controllers
{
    [ApiController]
    [Route("api/brands")]
    public class BrandsController : ControllerBase
    {
        private readonly IBrandService _brandService;

        public BrandsController(IBrandService brandService)
        {
            _brandService = brandService;
        }

        /// <summary>
        /// Returns all brands ordered by name.
        /// </summary>
        [HttpGet]
        [ResponseCache(Duration = 300)]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var brands = await _brandService.GetAllAsync(cancellationToken);
            return Ok(ApiResponse<object>.SuccessResponse(brands));
        }
    }
}
