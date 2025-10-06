using MasarSkills.API.Data;
using MasarSkills.API.DTOs;
using MasarSkills.API.Helpers;
using MasarSkills.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MasarSkills.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IJwtHelper _jwtHelper;

        public AuthService(ApplicationDbContext context, IJwtHelper jwtHelper)
        {
            _context = context;
            _jwtHelper = jwtHelper;
        }

        public async Task<AuthResponse> Register(RegisterDto registerDto)
        {
            try
            {
                // Check if user exists
                if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
                    return new AuthResponse { Success = false, Message = "User already exists" };

                // Create password hash
                PasswordHasher.CreatePasswordHash(registerDto.Password, out byte[] passwordHash, out byte[] passwordSalt);

                // 🔹 Generate PaymentId based on role
                int count = await _context.Users.CountAsync(u => u.Role == registerDto.Role);
                string paymentId = registerDto.Role switch
                {
                    "Student" => $"STU{(count + 1):D3}",
                    "Instructor" => $"INST{(count + 1):D3}",
                    "Admin" => $"ADM{(count + 1):D3}",
                    _ => $"USR{(count + 1):D3}"
                };

                // Create user
                var user = new User
                {
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    Email = registerDto.Email,
                    PasswordHash = passwordHash,
                    PasswordSalt = passwordSalt,
                    Role = registerDto.Role,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    IsActive = true,
                    PaymentId = paymentId   // ✅ added
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Create profile based on role
                if (registerDto.Role == "Student")
                {
                    var studentProfile = new StudentProfile
                    {
                        UserId = user.Id,
                        PhoneNumber = registerDto.PhoneNumber,
                    };
                    _context.StudentProfiles.Add(studentProfile);
                }
                else if (registerDto.Role == "Instructor")
                {
                    var instructorProfile = new InstructorProfile
                    {
                        UserId = user.Id,
                        PhoneNumber = registerDto.PhoneNumber,
                        Specialization = registerDto.Specialization
                    };
                    _context.InstructorProfiles.Add(instructorProfile);
                }

                await _context.SaveChangesAsync();

                // Generate token
                var token = _jwtHelper.GenerateToken(user);

                return new AuthResponse
                {
                    Success = true,
                    Token = token,
                    User = new UserDto
                    {
                        Id = user.Id,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Email = user.Email,
                        Role = user.Role
                    }
                };
            }
            catch (Exception ex)
            {
                return new AuthResponse { Success = false, Message = ex.Message };
            }
        }

        public async Task<AuthResponse> Login(LoginDto loginDto)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);

                if (user == null)
                    return new AuthResponse { Success = false, Message = "User not found" };

                if (!PasswordHasher.VerifyPasswordHash(loginDto.Password, user.PasswordHash, user.PasswordSalt))
                    return new AuthResponse { Success = false, Message = "Invalid password" };

                if (!user.IsActive)
                    return new AuthResponse { Success = false, Message = "Account deactivated" };

                var token = _jwtHelper.GenerateToken(user);

                return new AuthResponse
                {
                    Success = true,
                    Token = token,
                    StudentId = user.Role == "Student" ? user.Id : (int?)null,
                    User = new UserDto
                    {
                        Id = user.Id,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Email = user.Email,
                        Role = user.Role
                    }
                };
            }
            catch (Exception ex)
            {
                return new AuthResponse { Success = false, Message = ex.Message };
            }
        }

        // أضف هذه الدالة الجديدة للتحقق من الـ Token
        public async Task<AuthResponse> ValidateToken(string token)
        {
            try
            {
                var result = _jwtHelper.ValidateToken(token);
                bool isValid = result.isValid;
                ClaimsPrincipal principal = result.principal;

                if (!isValid || principal == null)
                {
                    return new AuthResponse { Success = false, Message = "Invalid token" };
                }

                // 🔍 DEBUG: عرض جميع الـ claims
                Console.WriteLine("=== جميع الـ Claims في الـ Token ===");
                foreach (var claim in principal.Claims)
                {
                    Console.WriteLine($"Type: {claim.Type}, Value: {claim.Value}");
                }
                Console.WriteLine("===================================");

                // البحث عن الـ UserId باستخدام أسماء الـ Claims الصحيحة
                var userIdClaim = principal.FindFirst("nameid") ??
                                 principal.FindFirst(ClaimTypes.NameIdentifier) ??
                                 principal.FindFirst("sub") ??
                                 principal.FindFirst("userId");

                if (userIdClaim == null)
                {
                    Console.WriteLine("❌ لم يتم العثور على أي claim يحتوي على UserId");
                    return new AuthResponse { Success = false, Message = "User ID not found in token" };
                }

                Console.WriteLine($"✅ تم العثور على UserId: {userIdClaim.Value} في claim: {userIdClaim.Type}");

                if (!int.TryParse(userIdClaim.Value, out int userId))
                {
                    Console.WriteLine($"❌ لا يمكن تحويل UserId '{userIdClaim.Value}' إلى رقم");
                    return new AuthResponse { Success = false, Message = "Invalid user ID format" };
                }

                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    Console.WriteLine($"❌ لم يتم العثور على user بالرقم: {userId}");
                    return new AuthResponse { Success = false, Message = "User not found" };
                }

                if (!user.IsActive)
                {
                    Console.WriteLine($"❌ User {userId} غير مفعل");
                    return new AuthResponse { Success = false, Message = "Account deactivated" };
                }

                Console.WriteLine($"✅ تم العثور على user: {user.FirstName} {user.LastName}");

                return new AuthResponse
                {
                    Success = true,
                    User = new UserDto
                    {
                        Id = user.Id,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Email = user.Email,
                        Role = user.Role
                    }
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ خطأ في ValidateToken: {ex.Message}");
                return new AuthResponse { Success = false, Message = ex.Message };
            }
        }
    }
}