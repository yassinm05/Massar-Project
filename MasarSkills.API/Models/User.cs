using System.ComponentModel.DataAnnotations;

namespace MasarSkills.API.Models
{
    public class User
    {
        #region Property
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; }

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        [Required]
        public byte[] PasswordHash { get; set; }

        [Required]
        public byte[] PasswordSalt { get; set; }

        [Required]
        public string Role { get; set; } // Student, Instructor, Admin

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public bool IsActive { get; set; } = true;
        #endregion

        #region Navigation Property
        public virtual StudentProfile StudentProfile { get; set; }
        public virtual InstructorProfile InstructorProfile { get; set; }
        public virtual ICollection<CourseEnrollment> CourseEnrollments { get; set; }
        #endregion
    }
}
