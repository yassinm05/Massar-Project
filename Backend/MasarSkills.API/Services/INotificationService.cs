using MasarSkills.API.Data;
using MasarSkills.API.DTOs;
using MasarSkills.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MasarSkills.API.Services
{
    public interface INotificationService
    {
        Task<List<NotificationDto>> GetUserNotifications(int userId, int page = 1, int pageSize = 20);
        Task<NotificationCountDto> GetNotificationCount(int userId);
        Task MarkAsRead(int userId, MarkAsReadDto markAsReadDto);
        Task CreateNotification(CreateNotificationDto notificationDto);
        Task CreateNotificationForAdmins(string title, string message, string type, string relatedEntityType = null, int? relatedEntityId = null);
    }

    public class NotificationService : INotificationService
    {
        private readonly ApplicationDbContext _context;

        public NotificationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<NotificationDto>> GetUserNotifications(int userId, int page = 1, int pageSize = 20)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(n => new NotificationDto
                {
                    Id = n.Id,
                    Title = n.Title,
                    Message = n.Message,
                    Type = n.Type,
                    IsRead = n.IsRead,
                    RelatedEntityType = n.RelatedEntityType,
                    RelatedEntityId = n.RelatedEntityId,
                    CreatedAt = n.CreatedAt,
                    ReadAt = n.ReadAt,
                    TimeAgo = GetTimeAgo(n.CreatedAt)
                })
                .ToListAsync();

            return notifications;
        }

        public async Task<NotificationCountDto> GetNotificationCount(int userId)
        {
            var totalCount = await _context.Notifications
                .CountAsync(n => n.UserId == userId);

            var unreadCount = await _context.Notifications
                .CountAsync(n => n.UserId == userId && !n.IsRead);

            return new NotificationCountDto
            {
                TotalCount = totalCount,
                UnreadCount = unreadCount
            };
        }

        public async Task MarkAsRead(int userId, MarkAsReadDto markAsReadDto)
        {
            if (markAsReadDto.MarkAllAsRead)
            {
                var unreadNotifications = await _context.Notifications
                    .Where(n => n.UserId == userId && !n.IsRead)
                    .ToListAsync();

                foreach (var notification in unreadNotifications)
                {
                    notification.IsRead = true;
                    notification.ReadAt = DateTime.UtcNow;
                }
            }
            else if (markAsReadDto.NotificationIds != null && markAsReadDto.NotificationIds.Any())
            {
                var notificationsToMark = await _context.Notifications
                    .Where(n => n.UserId == userId && markAsReadDto.NotificationIds.Contains(n.Id))
                    .ToListAsync();

                foreach (var notification in notificationsToMark)
                {
                    notification.IsRead = true;
                    notification.ReadAt = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync();
        }

        public async Task CreateNotification(CreateNotificationDto notificationDto)
        {
            var notification = new Notification
            {
                UserId = notificationDto.UserId,
                Title = notificationDto.Title,
                Message = notificationDto.Message,
                Type = notificationDto.Type,
                RelatedEntityType = notificationDto.RelatedEntityType,
                RelatedEntityId = notificationDto.RelatedEntityId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task CreateNotificationForAdmins(string title, string message, string type, string relatedEntityType = null, int? relatedEntityId = null)
        {
            var adminUsers = await _context.Users
                .Where(u => u.Role == "Admin" && u.IsActive)
                .ToListAsync();

            foreach (var admin in adminUsers)
            {
                var notification = new Notification
                {
                    UserId = admin.Id,
                    Title = title,
                    Message = message,
                    Type = type,
                    RelatedEntityType = relatedEntityType,
                    RelatedEntityId = relatedEntityId,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Notifications.Add(notification);
            }

            await _context.SaveChangesAsync();
        }

        private static string GetTimeAgo(DateTime dateTime)
        {
            var timeSpan = DateTime.UtcNow - dateTime;

            if (timeSpan.TotalDays > 30)
            {
                return dateTime.ToString("yyyy-MM-dd");
            }
            else if (timeSpan.TotalDays > 1)
            {
                return $"{(int)timeSpan.TotalDays} days ago";
            }
            else if (timeSpan.TotalHours > 1)
            {
                return $"{(int)timeSpan.TotalHours} hours ago";
            }
            else if (timeSpan.TotalMinutes > 1)
            {
                return $"{(int)timeSpan.TotalMinutes} minutes ago";
            }
            else
            {
                return "Just now";
            }
        }
    }
}