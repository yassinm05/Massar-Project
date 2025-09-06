using System.ComponentModel.DataAnnotations;

namespace MasarSkills.API.Models
{
    public class QuizAnswer
    {
        #region Property
        public int Id { get; set; }

        [Required]
        public int QuizAttemptId { get; set; }

        [Required]
        public int QuestionId { get; set; }

        public int? SelectedOptionId { get; set; }

        [MaxLength(1000)]
        public string TextAnswer { get; set; }

        public bool IsCorrect { get; set; }

        public int PointsEarned { get; set; }

        public DateTime AnsweredAt { get; set; } = DateTime.UtcNow;
        #endregion
        #region Navigation Property
        public virtual QuizAttempt QuizAttempt { get; set; }
        public virtual QuizQuestion Question { get; set; }
        public virtual QuestionOption SelectedOption { get; set; }
        #endregion
    }
}
