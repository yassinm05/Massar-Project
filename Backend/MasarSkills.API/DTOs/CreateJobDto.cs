using System.ComponentModel.DataAnnotations;

namespace MasarSkills.API.DTOs
{
    public class CreateJobDto
    {
        [Required, MaxLength(200)]
        public string Title { get; set; }

        [Required, MaxLength(500)]
        public string Description { get; set; }

        [Required, MaxLength(200)]
        public string CompanyName { get; set; }

        [Required, MaxLength(200)]
        public string Location { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Salary { get; set; }
    }
}
