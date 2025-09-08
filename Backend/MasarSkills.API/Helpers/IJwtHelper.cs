using MasarSkills.API.Models;
using System.Security.Claims;

namespace MasarSkills.API.Helpers
{
    public interface IJwtHelper
    {
        string GenerateToken(User user);
        (bool isValid, ClaimsPrincipal principal) ValidateToken(string token);
    }
}