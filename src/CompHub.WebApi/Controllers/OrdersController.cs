using CompHub.WebApi.Application.Common;
using CompHub.WebApi.Application.DTO.Requests;
using CompHub.WebApi.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CompHub.WebApi.Controllers
{
    [Route("api/orders")]
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        /// <summary>
        /// Returns all orders of the current user.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetMyOrders(CancellationToken cancellationToken)
        {
            var orders = await _orderService.GetByUserIdAsync(CurrentUserId, cancellationToken);
            return Ok(ApiResponse<object>.SuccessResponse(orders));
        }

        /// <summary>
        /// Returns order details. Only accessible by the order owner.
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
        {
            var order = await _orderService.GetByIdAsync(id, CurrentUserId, cancellationToken);

            if (order is null)
                return NotFound(ApiResponse.ErrorResponse($"Order {id} not found."));

            return Ok(ApiResponse<object>.SuccessResponse(order));
        }

        /// <summary>
        /// Places a new order for the current user.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] CreateOrderRequest request,
            CancellationToken cancellationToken)
        {
            var order = await _orderService.CreateAsync(CurrentUserId, request, cancellationToken);
            return CreatedAtAction(
                nameof(GetById),
                new { id = order.Id },
                ApiResponse<object>.SuccessResponse(order, "Order placed successfully."));
        }

        /// <summary>
        /// Updates the status of an order. Admin only.
        /// </summary>
        [HttpPatch("{id:int}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(
            int id,
            [FromBody] UpdateOrderStatusRequest request,
            CancellationToken cancellationToken)
        {
            var order = await _orderService.UpdateStatusAsync(id, request, cancellationToken);
            return Ok(ApiResponse<object>.SuccessResponse(order));
        }
    }
}
