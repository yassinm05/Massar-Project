using System.Security.Claims;
using MasarSkills.API.Data;
using MasarSkills.API.DTOs;
using MasarSkills.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MasarSkills.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobApplicationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public JobApplicationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [HttpPost]
        public async Task<IActionResult> Apply([FromForm] JobApplicationCreateDto applicationDto)
        {
            // --- Step 1: Get the authenticated user's ID from the token ---
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString))
            {
                return Unauthorized("User is not authenticated or token is invalid.");
            }
            var userId = int.Parse(userIdString);

            // --- Step 2: Handle the File Upload ---
            if (applicationDto.ResumeFile == null || applicationDto.ResumeFile.Length == 0)
            {
                return BadRequest("A resume file is required.");
            }

            var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "resumes");
            if (!Directory.Exists(uploadsFolderPath))
            {
                Directory.CreateDirectory(uploadsFolderPath);
            }

            var uniqueFileName = $"{Guid.NewGuid()}_{applicationDto.ResumeFile.FileName}";
            var filePath = Path.Combine(uploadsFolderPath, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await applicationDto.ResumeFile.CopyToAsync(stream);
            }

            // --- Step 3: Map the DTO to your database model ---
            var newApplication = new JobApplication
            {
                JobId = applicationDto.JobId,
                UserId = userId,
                CoverLetter = applicationDto.CoverLetter,
                PreviousWorkExperience = applicationDto.PreviousWorkExperience,
                NursingCompetencies = applicationDto.NursingCompetencies,
                PreferredShift = applicationDto.PreferredShift,
                LicenseCertificationNumber = applicationDto.LicenseCertificationNumber,
                ResumeUrl = $"/resumes/{uniqueFileName}",
            };

            // --- Step 4: Save, Generate Confirmation, Save Again, and Return ---

            // First Save: Persist the application to the database to generate its unique Id.
            _context.JobApplications.Add(newApplication);
            await _context.SaveChangesAsync();

            // Generate a unique, user-friendly confirmation number.
            // Using the new Id makes it traceable.
            var confirmationNumber = $"#{new Random().Next(100, 999)}-{newApplication.Id}";

            // Update the object with the new confirmation number.
            newApplication.ConfirmationNumber = confirmationNumber;
            
            // Second Save: Persist the confirmation number to the database.
            await _context.SaveChangesAsync();

            // Final Step: Return ONLY the confirmation number in a simple object.
            return Ok(new { confirmationNumber = newApplication.ConfirmationNumber });
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetApplicationById(int id)
        {
            var application = await _context.JobApplications
                .Include(a => a.User)
                .Include(a => a.Job)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (application == null) return NotFound();
            return Ok(application);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetApplicationsByUser(int userId)
        {
            var applications = await _context.JobApplications
                .Include(a => a.Job)
                .Where(a => a.UserId == userId)
                .ToListAsync();

            return Ok(applications);
        }

        [HttpGet("job/{jobId}")]
        public async Task<IActionResult> GetApplicationsByJob(int jobId)
        {
            var applications = await _context.JobApplications
                .Include(a => a.User)
                .Where(a => a.JobId == jobId)
                .ToListAsync();

            return Ok(applications);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateApplication(int id, [FromBody] JobApplication updated)
        {
            var application = await _context.JobApplications.FindAsync(id);
            if (application == null) return NotFound();

            application.CoverLetter = updated.CoverLetter;
            application.ResumeUrl = updated.ResumeUrl;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteApplication(int id)
        {
            var application = await _context.JobApplications.FindAsync(id);
            if (application == null) return NotFound();

            _context.JobApplications.Remove(application);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
