using System.ComponentModel.DataAnnotations;

namespace MasarSkills.API.Models
{
    public class LearningMaterial
    {
        #region Property
        public int Id { get; set; }
        public int ModuleId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        public string Description { get; set; }

        [Required]
        public MaterialType Type { get; set; }

        [MaxLength(500)]
        public string ContentUrl { get; set; }

        public int DurationMinutes { get; set; }
        public int Order { get; set; }
        public bool IsPreview { get; set; }
        #endregion
        #region Navigation Property
        public virtual CourseModule Module { get; set; }
        #endregion
    }
    #region Enum
    public enum MaterialType
    {
        Video,
        PDF,
        Document
    }
    #endregion
}
