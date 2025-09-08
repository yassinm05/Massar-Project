using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MasarSkills.API.Models;
using Microsoft.IdentityModel.Tokens;

namespace MasarSkills.API.Helpers
{
    public class JwtHelper : IJwtHelper
    {
        private readonly IConfiguration _configuration;

        public JwtHelper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Secret"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim("nameid", user.Id.ToString()),
            new Claim("email", user.Email),
            new Claim("unique_name", $"{user.FirstName} {user.LastName}"),
            new Claim("role", user.Role),
            new Claim("aud", _configuration["Jwt:Audience"]) // ⚠️ أضف هذا السطر
        }),
                Expires = DateTime.UtcNow.AddHours(Convert.ToDouble(_configuration["Jwt:ExpireHours"] ?? "24")),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["Jwt:Issuer"], // ⚠️ أضف هذا
                Audience = _configuration["Jwt:Audience"] // ⚠️ أضف هذا
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        public (bool isValid, ClaimsPrincipal principal) ValidateToken(string token)
        {
            try
            {
                Console.WriteLine("🔐 بدء التحقق من الـ Token...");

                var tokenHandler = new JwtSecurityTokenHandler();

                var secret = _configuration["Jwt:Secret"];
                var issuer = _configuration["Jwt:Issuer"];
                var audience = _configuration["Jwt:Audience"];

                Console.WriteLine($"🔑 Secret: {!string.IsNullOrEmpty(secret)}");
                Console.WriteLine($"🏢 Issuer: {issuer}");
                Console.WriteLine($"👥 Audience: {audience}");  // ⚠️ هذا مهم

                if (string.IsNullOrEmpty(audience))
                {
                    Console.WriteLine("❌ JWT Audience is missing or empty");
                    return (false, null);
                }

                var key = Encoding.ASCII.GetBytes(secret);

                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = issuer,
                    ValidateAudience = false, 
                                            
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                Console.WriteLine("✅ بدء التحقق من صحة الـ Token...");
                var principal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);

                Console.WriteLine("✅ تم التحقق من صحة الـ Token بنجاح");
                return (true, principal);
            }
            catch (SecurityTokenInvalidAudienceException ex)
            {
                Console.WriteLine($"❌ Audience غير صحيح: {ex.Message}");
                Console.WriteLine($"⚠️  المتوقع: {_configuration["Jwt:Audience"]}");
                Console.WriteLine($"⚠️  تأكد من إعدادات appsettings.json");
                return (false, null);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ خطأ في التحقق: {ex.GetType().Name}: {ex.Message}");
                return (false, null);
            }
        }
    }
}