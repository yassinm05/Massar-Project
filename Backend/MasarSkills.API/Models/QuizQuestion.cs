using System.ComponentModel.DataAnnotations;

namespace MasarSkills.API.Models
{
    public class QuizQuestion
    {
        #region Property
        public int Id { get; set; }
        public int QuizId { get; set; }

        [Required]
        public string QuestionText { get; set; }

        public string QuestionType { get; set; }
        public int Points { get; set; } = 1;
        public int Order { get; set; }
        public int TopicId { get; set; }
        #endregion
        #region Navigation Property
        public virtual Quiz Quiz { get; set; }
        public virtual ICollection<QuestionOption> Options { get; set; }
        public virtual ICollection<QuizAnswer> QuizAnswers { get; set; }
         public virtual Topics Topic { get; set; }
        #endregion
    }
}
