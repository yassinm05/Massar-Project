using System.ComponentModel.DataAnnotations;

namespace MasarSkills.API.Models
{
    public class CourseEnrollment
    {
        #region Property
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int CourseId { get; set; }

        public DateTime EnrollmentDate { get; set; } = DateTime.UtcNow;
        public DateTime? CompletionDate { get; set; }
        public decimal ProgressPercentage { get; set; }

        [MaxLength(20)]
        public string Status { get; set; }

        public decimal? FinalGrade { get; set; }
        #endregion
        #region Navigation Property
        public virtual User Student { get; set; }
        public virtual Course Course { get; set; }
        public virtual ICollection<QuizAttempt> QuizAttempts { get; set; }
        #endregion
    }
}
