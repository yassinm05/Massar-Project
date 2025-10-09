using System;
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

        // --- NEW FIELD TO STORE THE CONFIRMATION NUMBER ---
        [MaxLength(20)]
        public string? ConfirmationNumber { get; set; }

        // --- Fields from the form ---
        public string? LicenseCertificationNumber { get; set; }

        [Required, MaxLength(2000)]
        public string PreviousWorkExperience { get; set; }

        [Required, MaxLength(1000)]
        public string NursingCompetencies { get; set; }

        [Required, MaxLength(50)]
        public string PreferredShift { get; set; }

        // --- Navigation Properties ---
        public Job Job { get; set; }
        public User User { get; set; }
    }
}