namespace MasarSkills.API.DTOs
{
    public class NotificationDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public string Type { get; set; }
        public bool IsRead { get; set; }
        public string RelatedEntityType { get; set; }
        public int? RelatedEntityId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ReadAt { get; set; }
        public string TimeAgo { get; set; }
    }

    public class CreateNotificationDto
    {
        public int UserId { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public string Type { get; set; }
        public string RelatedEntityType { get; set; }
        public int? RelatedEntityId { get; set; }
    }

    public class MarkAsReadDto
    {
        public bool MarkAllAsRead { get; set; }
        public List<int>? NotificationIds { get; set; }
    }

    public class NotificationCountDto
    {
        public int TotalCount { get; set; }
        public int UnreadCount { get; set; }
    }
}