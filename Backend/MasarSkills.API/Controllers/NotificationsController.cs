using Microsoft.AspNetCore.Mvc;
using MasarSkills.API.DTOs;
using MasarSkills.API.Services;
using MasarSkills.API.Helpers;
using System.Security.Claims;

namespace MasarSkills.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        // GET: api/notifications
        [HttpGet]
        public async Task<IActionResult> GetNotifications([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var userId = UserHelper.GetUserId(User);
                var notifications = await _notificationService.GetUserNotifications(userId, page, pageSize);
                return Ok(notifications);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        // GET: api/notifications/count
        [HttpGet("count")]
        public async Task<IActionResult> GetNotificationCount()
        {
            try
            {
                var userId = UserHelper.GetUserId(User);
                var count = await _notificationService.GetNotificationCount(userId);
                return Ok(count);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        // POST: api/notifications/mark-as-read
        [HttpPost("mark-as-read")]
        public async Task<IActionResult> MarkAsRead([FromBody] MarkAsReadDto markAsReadDto)
        {
            try
            {
                var userId = UserHelper.GetUserId(User);
                await _notificationService.MarkAsRead(userId, markAsReadDto);
                return Ok(new { message = "Notifications marked as read" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }
    }
}