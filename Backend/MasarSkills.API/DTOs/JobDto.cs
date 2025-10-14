using System.ComponentModel.DataAnnotations;

namespace MasarSkills.API.DTOs
{
    public class JobDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string CompanyName { get; set; }
        public string Location { get; set; }
        public decimal Salary { get; set; }
        public DateTime PostedAt { get; set; }
        public string Qualifications { get; set; }
        public string Responsibilities { get; set; }
    }

    public class JobListDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string CompanyName { get; set; }
        public string Location { get; set; }
    }
    public class JobApplicationCreateDto
    {
        [Required]
        public int JobId { get; set; }

        [Required(ErrorMessage = "Previous work experience is required.")]
        [MaxLength(2000)]
        public string PreviousWorkExperience { get; set; }

        [Required(ErrorMessage = "Nursing competencies are required.")]
        [MaxLength(1000)]
        public string NursingCompetencies { get; set; }

        [Required(ErrorMessage = "Preferred shift is required.")]
        [MaxLength(50)]
        public string PreferredShift { get; set; }

        [MaxLength(100)]
        public string? LicenseCertificationNumber { get; set; }

        // This property will hold the uploaded resume file
        [Required(ErrorMessage = "A resume file is required.")]
        public IFormFile ResumeFile { get; set; }
    }
}

