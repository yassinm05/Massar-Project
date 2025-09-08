using MasarSkills.API.DTOs;
using System.Security.Claims;
namespace MasarSkills.API.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> Register(RegisterDto registerDto);
        Task<AuthResponse> Login(LoginDto loginDto);
        Task<AuthResponse> ValidateToken(string token);
    }
}