using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MasarSkills.API.Models
{
    public class Notification
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        [Required]
        [MaxLength(500)]
        public string Message { get; set; }

        [Required]
        [MaxLength(20)]
        public string Type { get; set; } // Info, Success, Warning, Error, Payment, Course, System

        public bool IsRead { get; set; } = false;

        public string RelatedEntityType { get; set; } // Course, Payment, Quiz, etc.
        public int? RelatedEntityId { get; set; } // ID of the related entity

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ReadAt { get; set; }

        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }

    public enum NotificationType
    {
        Info,
        Success,
        Warning,
        Error,
        Payment,
        Course,
        System
    }
}