using System.Text.Json.Serialization;
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

    public class LearningMaterialResponseDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;

        [JsonPropertyName("description")]
        public string Description { get; set; } = string.Empty;

        [JsonPropertyName("contentUrl")]
        public string ContentUrl { get; set; } = string.Empty;

        [JsonPropertyName("type")]
        public string Type { get; set; } = string.Empty;
    }
}
