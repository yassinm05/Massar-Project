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
    }
}

