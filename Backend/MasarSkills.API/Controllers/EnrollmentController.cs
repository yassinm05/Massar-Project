using Microsoft.AspNetCore.Mvc;
using MasarSkills.API.Data;
using MasarSkills.API.Models;
using MasarSkills.API.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MasarSkills.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EnrollmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EnrollmentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/enrollment/enroll
        [HttpPost("enroll")]
        public async Task<IActionResult> EnrollInCourse([FromBody] EnrollmentDto enrollmentDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            // Check if already enrolled
            var existingEnrollment = await _context.CourseEnrollments
                .FirstOrDefaultAsync(ce => ce.StudentId == userId && ce.CourseId == enrollmentDto.CourseId);

            if (existingEnrollment != null)
            {
                return BadRequest(new { message = "Student is already enrolled in this course" });
            }

            var enrollment = new CourseEnrollment
            {
                StudentId = userId,
                CourseId = enrollmentDto.CourseId,
                EnrollmentDate = DateTime.UtcNow,
                ProgressPercentage = 0,
                Status = "Enrolled"
            };

            _context.CourseEnrollments.Add(enrollment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Enrollment successful", enrollmentId = enrollment.Id });
        }

        // GET: api/enrollment/my-courses
        [HttpGet("my-courses")]
        public async Task<IActionResult> GetMyCourses()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var enrollments = await _context.CourseEnrollments
                .Include(ce => ce.Course)
                .ThenInclude(c => c.Instructor)
                .ThenInclude(i => i.User)
                .Where(ce => ce.StudentId == userId)
                .Select(ce => new EnrollmentResponseDto
                {
                    EnrollmentId = ce.Id,
                    CourseId = ce.CourseId,
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

        // PUT: api/enrollment/update-progress/{enrollmentId}
        [HttpPut("update-progress/{enrollmentId}")]
        public async Task<IActionResult> UpdateProgress(int enrollmentId, [FromBody] UpdateProgressDto progressDto)
        {
            var enrollment = await _context.CourseEnrollments.FindAsync(enrollmentId);

            if (enrollment == null)
            {
                return NotFound();
            }

            enrollment.ProgressPercentage = progressDto.ProgressPercentage;

            if (progressDto.ProgressPercentage >= 100)
            {
                enrollment.Status = "Completed";
                enrollment.CompletionDate = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Progress updated successfully" });
        }
    }

    public class EnrollmentDto
    {
        public int CourseId { get; set; }
    }

    public class EnrollmentResponseDto
    {
        public int EnrollmentId { get; set; }
        public int CourseId { get; set; }
        public string CourseTitle { get; set; }
        public string InstructorName { get; set; }
        public DateTime EnrollmentDate { get; set; }
        public decimal ProgressPercentage { get; set; }
        public string Status { get; set; }
        public decimal? FinalGrade { get; set; }
    }

    public class UpdateProgressDto
    {
        public decimal ProgressPercentage { get; set; }
    }
}