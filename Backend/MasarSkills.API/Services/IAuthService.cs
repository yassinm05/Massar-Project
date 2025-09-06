using MasarSkills.API.DTOs;

namespace MasarSkills.API.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> Register(RegisterDto registerDto);
        Task<AuthResponse> Login(LoginDto loginDto);
    }
}
