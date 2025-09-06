using System.ComponentModel.DataAnnotations;

namespace MasarSkills.API.Models
{
    public class AdminProfile
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        [MaxLength(20)]
        public string PhoneNumber { get; set; }

        [MaxLength(200)]
        public string Department { get; set; }

        public DateTime HireDate { get; set; } = DateTime.UtcNow;

        [MaxLength(500)]
        public string Responsibilities { get; set; }

        public virtual User User { get; set; }
    }
}