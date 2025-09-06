namespace MasarSkills.API.DTOs
{
    public class CourseDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int DurationHours { get; set; }
        public string ThumbnailUrl { get; set; }
        public string InstructorName { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
