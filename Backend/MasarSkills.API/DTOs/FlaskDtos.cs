using System.Text.Json.Serialization;

namespace MasarSkills.API.DTOs
{
    /// <summary>
    /// Represents the JSON body we will POST to the Python Flask API.
    /// </summary>
    public class FlaskRequestDto
    {
        [JsonPropertyName("context")]
        public string Context { get; set; } = string.Empty;
        
        [JsonPropertyName("prompt")]
        public string Prompt { get; set; } = string.Empty;
    }

    /// <summary>
    /// Represents the JSON response we expect from the Python Flask API.
    /// </summary>
    public class FlaskResponseDto
    {
        [JsonPropertyName("answer")]
        public string? Answer { get; set; }
    }
}
