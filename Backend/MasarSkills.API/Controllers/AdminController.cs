using Microsoft.AspNetCore.Mvc;
using MasarSkills.API.Data;
using MasarSkills.API.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MasarSkills.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/admin/users
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Include(u => u.StudentProfile)
                .Include(u => u.InstructorProfile)
                .Include(u => u.AdminProfile)
                .Select(u => new AdminUserDto
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    Role = u.Role,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt,
                    PhoneNumber = u.StudentProfile != null ? u.StudentProfile.PhoneNumber :
                                u.InstructorProfile != null ? u.InstructorProfile.PhoneNumber :
                                u.AdminProfile != null ? u.AdminProfile.PhoneNumber : null
                })
                .OrderByDescending(u => u.CreatedAt)
                .ToListAsync();

            return Ok(users);
        }

        // GET: api/admin/payments
        [HttpGet("payments")]
        public async Task<IActionResult> GetAllPayments()
        {
            var payments = await _context.Payments
                .Include(p => p.User)
                .Include(p => p.Course)
                .OrderByDescending(p => p.PaymentDate)
                .Select(p => new AdminPaymentDto
                {
                    Id = p.Id,
                    UserName = $"{p.User.FirstName} {p.User.LastName}",
                    UserEmail = p.User.Email,
                    CourseTitle = p.Course != null ? p.Course.Title : "General Payment",
                    Amount = p.Amount,
                    AmountPaid = p.AmountPaid,
                    PaymentMethod = p.PaymentMethod,
                    TransactionId = p.TransactionId,
                    PaymentStatus = p.PaymentStatus,
                    PaymentDate = p.PaymentDate
                })
                .ToListAsync();

            return Ok(payments);
        }

        // GET: api/admin/statistics
        [HttpGet("statistics")]
        public async Task<IActionResult> GetStatistics()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalStudents = await _context.Users.CountAsync(u => u.Role == "Student");
            var totalInstructors = await _context.Users.CountAsync(u => u.Role == "Instructor");
            var totalCourses = await _context.Courses.CountAsync();
            var totalEnrollments = await _context.CourseEnrollments.CountAsync();

            var totalRevenue = await _context.Payments
                .Where(p => p.PaymentStatus == "Completed")
                .SumAsync(p => p.AmountPaid);

            var recentPayments = await _context.Payments
                .Where(p => p.PaymentStatus == "Completed")
                .OrderByDescending(p => p.PaymentDate)
                .Take(10)
                .ToListAsync();

            return Ok(new
            {
                TotalUsers = totalUsers,
                TotalStudents = totalStudents,
                TotalInstructors = totalInstructors,
                TotalCourses = totalCourses,
                TotalEnrollments = totalEnrollments,
                TotalRevenue = totalRevenue,
                RecentPayments = recentPayments
            });
        }

        // PUT: api/admin/users/{userId}/status
        [HttpPut("users/{userId}/status")]
        public async Task<IActionResult> UpdateUserStatus(int userId, [FromBody] UpdateUserStatusDto statusDto)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound();
            }

            user.IsActive = statusDto.IsActive;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "User status updated successfully" });
        }

        // GET: api/admin/enrollments
        [HttpGet("enrollments")]
        public async Task<IActionResult> GetAllEnrollments()
        {
            var enrollments = await _context.CourseEnrollments
                .Include(ce => ce.Student)
                .Include(ce => ce.Course)
                .ThenInclude(c => c.Instructor)
                .ThenInclude(i => i.User)
                .OrderByDescending(ce => ce.EnrollmentDate)
                .Select(ce => new AdminEnrollmentDto
                {
                    EnrollmentId = ce.Id,
                    StudentName = $"{ce.Student.FirstName} {ce.Student.LastName}",
                    CourseTitle = ce.Course.Title,
                    InstructorName = $"{ce.Course.Instructor.User.FirstName} {ce.Course.Instructor.User.LastName}",
                    EnrollmentDate = ce.EnrollmentDate,
                    ProgressPercentage = ce.ProgressPercentage,
                    Status = ce.Status,
                    FinalGrade = ce.FinalGrade
                })
                .ToListAsync();

            return Ok(enrollments);
        }
    }

    public class AdminUserDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public string PhoneNumber { get; set; }
    }

    public class AdminPaymentDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string UserEmail { get; set; }
        public string CourseTitle { get; set; }
        public decimal Amount { get; set; }
        public decimal AmountPaid { get; set; }
        public string PaymentMethod { get; set; }
        public string TransactionId { get; set; }
        public string PaymentStatus { get; set; }
        public DateTime PaymentDate { get; set; }
    }

    public class UpdateUserStatusDto
    {
        public bool IsActive { get; set; }
    }

    public class AdminEnrollmentDto
    {
        public int EnrollmentId { get; set; }
        public string StudentName { get; set; }
        public string CourseTitle { get; set; }
        public string InstructorName { get; set; }
        public DateTime EnrollmentDate { get; set; }
        public decimal ProgressPercentage { get; set; }
        public string Status { get; set; }
        public decimal? FinalGrade { get; set; }
    }
}