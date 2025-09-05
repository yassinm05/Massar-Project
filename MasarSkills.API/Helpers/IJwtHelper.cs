using MasarSkills.API.Models;

namespace MasarSkills.API.Helpers
{
    public interface IJwtHelper
    {
        string GenerateToken(User user);

    }
}
