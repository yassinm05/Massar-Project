using System.ComponentModel.DataAnnotations;

namespace MasarSkills.API.Models
{
    public class JobApplication
    {
        public int Id { get; set; }

        [Required]
        public int JobId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required, MaxLength(500)]
        public string CoverLetter { get; set; }

        public string ResumeUrl { get; set; }

        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Job Job { get; set; }
        public User User { get; set; }
    }
}
