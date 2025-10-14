using System.ComponentModel.DataAnnotations;

namespace MasarSkills.API.DTOs
{
    /// <summary>
    /// Represents the incoming request from the client to ask the AI a question.
    /// </summary>
    public class AIQueryDto
    {
        [Required]
        public int MaterialId { get; set; }

        [Required]
        [MinLength(5)]
        public string Question { get; set; } = string.Empty;
    }
}
