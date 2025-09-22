using MasarSkills.API.DTOs;
using MasarSkills.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace MasarSkills.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobsController : ControllerBase
    {
        private readonly IJobService _jobService;

        public JobsController(IJobService jobService)
        {
            _jobService = jobService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllJobs()
        {
            var jobs = await _jobService.GetAllJobsAsync();
            return Ok(jobs);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetJobById(int id)
        {
            var job = await _jobService.GetJobByIdAsync(id);
            if (job == null) return NotFound();
            return Ok(job);
        }

        [HttpPost]
        public async Task<IActionResult> CreateJob([FromBody] CreateJobDto jobDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var job = await _jobService.CreateJobAsync(jobDto);
            return CreatedAtAction(nameof(GetJobById), new { id = job.Id }, job);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var deleted = await _jobService.DeleteJobAsync(id);
            if (!deleted) return NotFound();

            return NoContent();
        }
    }
}
