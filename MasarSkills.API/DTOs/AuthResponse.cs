namespace MasarSkills.API.DTOs
{
    public class AuthResponse
    {
        public bool Success { get; set; }
        public string Token { get; set; }
        public UserDto User { get; set; }
        public string Message { get; set; }
    }
}
