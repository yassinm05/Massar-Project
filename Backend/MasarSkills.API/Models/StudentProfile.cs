using Microsoft.AspNetCore.Builder;
using System.ComponentModel.DataAnnotations;

namespace MasarSkills.API.Models
{
    public class StudentProfile
    {
        #region Property
        public int Id { get; set; }
        public int UserId { get; set; }

        [MaxLength(20)]
        public string PhoneNumber { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [MaxLength(200)]
        public string? Address { get; set; }

        [MaxLength(100)]
        public string? EducationLevel { get; set; }

        public string? CareerGoals { get; set; }
        public string? Skills { get; set; }
        #endregion
        #region Navigation Property
        public virtual User User { get; set; }
        public virtual ICollection<CourseEnrollment> CourseEnrollments { get; set; }
        #endregion
    }
}
