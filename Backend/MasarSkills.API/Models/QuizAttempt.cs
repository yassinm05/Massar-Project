namespace MasarSkills.API.Models
{
    public class QuizAttempt
    {
        #region Property
        public int Id { get; set; }
        public int EnrollmentId { get; set; }
        public int QuizId { get; set; }

        public DateTime StartTime { get; set; } = DateTime.UtcNow;
        public DateTime? EndTime { get; set; }
        public decimal Score { get; set; }
        public int AttemptNumber { get; set; } = 1;

        public string Status { get; set; }
        #endregion
        #region Navigation Property
        public virtual CourseEnrollment Enrollment { get; set; }
        public virtual Quiz Quiz { get; set; }
        public virtual ICollection<QuizAnswer> Answers { get; set; }
        #endregion
    }
}
