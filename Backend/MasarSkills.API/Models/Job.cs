using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MasarSkills.API.Models
{
    public class Job
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        [Required]
        [MaxLength(1000)]
        public string Description { get; set; }

        [Required]
        [MaxLength(200)]
        public string CompanyName { get; set; }

        [MaxLength(200)]
        public string Location { get; set; }

        // Fix for Salary precision
        [Column(TypeName = "decimal(18,2)")]
        public decimal Salary { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime PostedAt { get; set; } = DateTime.UtcNow;
    }
}
