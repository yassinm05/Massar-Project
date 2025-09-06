using System.ComponentModel.DataAnnotations;

namespace MasarSkills.API.Models
{
    public class InstructorProfile
    {
        #region Property
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }

        [MaxLength(20)]
        public string PhoneNumber { get; set; }

        [MaxLength(200)]
        public string Specialization { get; set; }

        public int YearsOfExperience { get; set; }

        [MaxLength(500)]
        public string Bio { get; set; }

        public string Qualifications { get; set; }
        #endregion
        #region Navigation Property
        public virtual User User { get; set; }
        public virtual ICollection<Course> Courses { get; set; }
        #endregion
    }
}
