using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace MasarSkills.API.Models
{
    public class Course
    {
        #region Property
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        public string Description { get; set; }

        [Precision(18, 2)]
        public decimal Price { get; set; }

        public int DurationHours { get; set; }

        [MaxLength(500)]
        public string ThumbnailUrl { get; set; }

        public bool IsActive { get; set; } = true;

        public int InstructorId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        #endregion
        #region Navigation Property
        public virtual InstructorProfile Instructor { get; set; }
        public virtual ICollection<CourseModule> Modules { get; set; }
        public virtual ICollection<CourseEnrollment> Enrollments { get; set; }
        #endregion
    }
}
