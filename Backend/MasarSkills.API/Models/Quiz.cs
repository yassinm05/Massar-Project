using System.ComponentModel.DataAnnotations;

namespace MasarSkills.API.Models
{
    public class Quiz
    {
        #region Property
        public int Id { get; set; }
        public int ModuleId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        public string Description { get; set; }

        public int TimeLimitMinutes { get; set; }
        public int PassingScore { get; set; }
        public int MaxAttempts { get; set; } = 1;

        public string ImagePath { get; set; }
        #endregion
        #region Navigation Property
        public virtual CourseModule Module { get; set; }
        public virtual ICollection<QuizQuestion> Questions { get; set; }
        public virtual ICollection<QuizAttempt> Attempts { get; set; }
        #endregion
    }
}
