using MasarSkills.API.Data;
using MasarSkills.API.DTOs;
using MasarSkills.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MasarSkills.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users
                .Include(u => u.StudentProfile)
                .Include(u => u.InstructorProfile)
                .Include(u => u.AdminProfile)
                .Where(u => u.IsActive)
                .ToListAsync();

            var result = users.Select(user => MapToDto(user)).ToList();

            return Ok(result);
        }

        // GET: api/users/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _context.Users
                .Include(u => u.StudentProfile)
                .Include(u => u.InstructorProfile)
                .Include(u => u.AdminProfile)
                .FirstOrDefaultAsync(u => u.Id == id && u.IsActive);

            if (user == null)
                return NotFound();

            return Ok(MapToDto(user));
        }

        // DELETE: api/users/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();

            user.IsActive = false;
            user.UpdatedAt = DateTime.UtcNow;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // 🔹 Helper method to map User to UserDto
        private UserDto MapToDto(User user)
        {
            var userDto = new UserDto
            {
                Id = user.Id,
                FullName = $"{user.FirstName} {user.LastName}",
                Email = user.Email,
                Role = user.Role
            };

            if (user.Role == "Student" && user.StudentProfile != null)
            {
                userDto.Profile = new StudentProfileDto
                {
                    PhoneNumber = user.StudentProfile.PhoneNumber,
                    DateOfBirth = user.StudentProfile.DateOfBirth,
                    Address = user.StudentProfile.Address,
                    EducationLevel = user.StudentProfile.EducationLevel,
                    CareerGoals = user.StudentProfile.CareerGoals,
                    Skills = user.StudentProfile.Skills
                };
            }
            else if (user.Role == "Instructor" && user.InstructorProfile != null)
            {
                userDto.Profile = new InstructorProfileDto
                {
                    PhoneNumber = user.InstructorProfile.PhoneNumber,
                    Specialization = user.InstructorProfile.Specialization,
                    YearsOfExperience = user.InstructorProfile.YearsOfExperience,
                    Bio = user.InstructorProfile.Bio,
                    Qualifications = user.InstructorProfile.Qualifications
                };
            }
            else if (user.Role == "Admin" && user.AdminProfile != null)
            {
                userDto.Profile = new AdminProfileDto
                {
                    PhoneNumber = user.AdminProfile.PhoneNumber,
                    Department = user.AdminProfile.Department,
                    HireDate = user.AdminProfile.HireDate,
                    Responsibilities = user.AdminProfile.Responsibilities
                };
            }

            return userDto;
        }
    }
}
