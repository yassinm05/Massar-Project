using System.ComponentModel.DataAnnotations;

namespace MasarSkills.API.Models
{
    public class QuestionOption
    {
        #region Property
        public int Id { get; set; }
        public int QuestionId { get; set; }

        [Required]
        public string OptionText { get; set; }

        public bool IsCorrect { get; set; }
        public int Order { get; set; }
        #endregion
        #region Navigation Prpperty
        public virtual QuizQuestion Question { get; set; }
        public virtual ICollection<QuizAnswer> QuizAnswers { get; set; }

        #endregion
    }
}
