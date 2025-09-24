namespace MasarSkills.API.DTOs
{
    public class CreateCourseDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int DurationHours { get; set; }
        public string ThumbnailUrl { get; set; }
        public int InstructorId { get; set; }
        public string Difficulty { get; set; }
    }
}
