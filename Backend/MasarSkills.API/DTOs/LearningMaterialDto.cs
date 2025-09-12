namespace MasarSkills.API.DTOs
{
    public class LearningMaterialDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public string ContentUrl { get; set; } = "";
        public string Type { get; set; } = "";
        public int DurationMinutes { get; set; }
        public bool IsPreview { get; set; }
    }
}
