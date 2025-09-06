using System.ComponentModel.DataAnnotations;

namespace MasarSkills.API.Models
{
    public class User
    {
        #region Property
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string FirstName { get; set; }

        [Required, MaxLength(100)]
        public string LastName { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public byte[] PasswordHash { get; set; }

        [Required]
        public byte[] PasswordSalt { get; set; }

        [Required]
        public string Role { get; set; } // Student, Instructor, Admin

        // إضافة حقل PaymentId للربط مع نظام الدفع

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public bool IsActive { get; set; } = true;

       
        #endregion
        public string PaymentId { get; set; }

        #region Navigation Property
        // Navigation properties
        public virtual StudentProfile StudentProfile { get; set; }
        public virtual InstructorProfile InstructorProfile { get; set; }
        public virtual AdminProfile AdminProfile { get; set; }
        public virtual ICollection<CourseEnrollment> CourseEnrollments { get; set; }
        public virtual ICollection<Payment> Payments { get; set; }
        #endregion
    }
}
