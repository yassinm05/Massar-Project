using MasarSkills.API.Data;
using MasarSkills.API.DTOs;
using MasarSkills.API.Helpers;
using MasarSkills.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;


namespace MasarSkills.API.Services
{
    public class AuthService:IAuthService
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
                    IsActive = true
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Create profile based on role
                if (registerDto.Role == "Student")
                {
                    var studentProfile = new StudentProfile
                    {
                        UserId = user.Id,
                        PhoneNumber = registerDto.PhoneNumber
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
    }
}

