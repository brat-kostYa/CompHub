using CompHub.WebApi.Application.Common;
using CompHub.WebApi.Application.DTO.QueryParams;
using CompHub.WebApi.Application.DTO.Requests;
using CompHub.WebApi.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CompHub.WebApi.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        /// <summary>
        /// Returns a paginated and filtered product list.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetFiltered(
            [FromQuery] ProductFilterParams filter,
            CancellationToken cancellationToken)
        {
            var result = await _productService.GetFilteredAsync(filter, cancellationToken);
            return Ok(ApiResponse<object>.SuccessResponse(result));
        }

        /// <summary>
        /// Returns full product details by id.
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
        {
            var product = await _productService.GetByIdAsync(id, cancellationToken);

            if (product is null)
                return NotFound(ApiResponse.ErrorResponse($"Product {id} not found."));

            return Ok(ApiResponse<object>.SuccessResponse(product));
        }

        /// <summary>
        /// Creates a new product.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] CreateProductRequest request,
            CancellationToken cancellationToken)
        {
            var product = await _productService.CreateAsync(request, cancellationToken);
            return CreatedAtAction(
                nameof(GetById),
                new { id = product.Id },
                ApiResponse<object>.SuccessResponse(product, "Product created successfully."));
        }

        /// <summary>
        /// Updates an existing product.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] UpdateProductRequest request,
            CancellationToken cancellationToken)
        {
            var product = await _productService.UpdateAsync(id, request, cancellationToken);

            if (product is null)
                return NotFound(ApiResponse.ErrorResponse($"Product {id} not found."));

            return Ok(ApiResponse<object>.SuccessResponse(product));
        }

        /// <summary>
        /// Deletes a product by id.
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var deleted = await _productService.DeleteAsync(id, cancellationToken);

            if (!deleted)
                return NotFound(ApiResponse.ErrorResponse($"Product {id} not found."));

            return NoContent();
        }
    }
}
