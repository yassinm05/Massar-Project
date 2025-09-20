using MasarSkills.API.Data;
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
        public async Task<IActionResult> Apply([FromBody] JobApplication application)
        {
            _context.JobApplications.Add(application);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetApplicationById), new { id = application.Id }, application);
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
