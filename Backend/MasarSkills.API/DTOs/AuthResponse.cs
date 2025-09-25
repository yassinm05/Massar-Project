using System.Text.Json.Serialization;

namespace MasarSkills.API.DTOs
{
    public class AuthResponse
    {
        public bool Success { get; set; }
        public string Token { get; set; }
        public UserDto User { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string Message { get; set; }
    }
}
