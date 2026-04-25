using CompHub.WebApi.Application.Common;
using CompHub.WebApi.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CompHub.WebApi.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        /// <summary>
        /// Returns all top-level categories with their sub-categories.
        /// </summary>
        [HttpGet]
        [ResponseCache(Duration = 300)]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var categories = await _categoryService.GetAllAsync(cancellationToken);
            return Ok(ApiResponse<object>.SuccessResponse(categories));
        }

        /// <summary>
        /// Returns a category with its specification keys.
        /// </summary>
        [HttpGet("{id:int}/spec-keys")]
        public async Task<IActionResult> GetWithSpecKeys(int id, CancellationToken cancellationToken)
        {
            var category = await _categoryService.GetWithSpecKeysAsync(id, cancellationToken);

            if (category is null)
                return NotFound(ApiResponse.ErrorResponse($"Category {id} not found."));

            return Ok(ApiResponse<object>.SuccessResponse(category));
        }

        /// <summary>
        /// Returns brands that have products in the given category.
        /// </summary>
        [HttpGet("{id:int}/brands")]
        [ResponseCache(Duration = 60)]
        public async Task<IActionResult> GetBrands(int id, CancellationToken cancellationToken)
        {
            var brands = await _categoryService.GetBrandsByCategoryAsync(id, cancellationToken);
            return Ok(ApiResponse<object>.SuccessResponse(brands));
        }
    }
}
