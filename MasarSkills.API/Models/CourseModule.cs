using System.ComponentModel.DataAnnotations;

namespace MasarSkills.API.Models
{
    public class CourseModule
    {
        #region Property
        public int Id { get; set; }
        public int CourseId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        public string Description { get; set; }

        public int Order { get; set; }
        #endregion
        #region Navigation Property
        public virtual Course Course { get; set; }
        public virtual ICollection<LearningMaterial> LearningMaterials { get; set; }
        public virtual ICollection<Quiz> Quizzes { get; set; }
        #endregion
    }
}
