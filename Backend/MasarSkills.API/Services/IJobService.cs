using MasarSkills.API.Data;
using MasarSkills.API.DTOs;
using MasarSkills.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MasarSkills.API.Services
{
    public interface IJobService
    {
        Task<IEnumerable<JobListDto>> GetAllJobsAsync();
        Task<JobDto> GetJobByIdAsync(int id);
        Task<JobDto> CreateJobAsync(CreateJobDto jobDto);
        Task<bool> DeleteJobAsync(int id);
    }

    public class JobService : IJobService
    {
        private readonly ApplicationDbContext _context;

        public JobService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<JobListDto>> GetAllJobsAsync()
        {
            var jobs = await _context.Jobs
                .Where(j => j.IsActive)
                .ToListAsync();

            // Now, we select only the three required properties into our new DTO
            return jobs.Select(j => new JobListDto
            {
                Id = j.Id,
                Title = j.Title,
                CompanyName = j.CompanyName,
                Location = j.Location
            });
        }

        public async Task<JobDto> GetJobByIdAsync(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null || !job.IsActive) return null;

            return new JobDto
            {
                Id = job.Id,
                Title = job.Title,
                Description = job.Description,
                CompanyName = job.CompanyName,
                Location = job.Location,
                Salary = job.Salary,
                PostedAt = job.PostedAt
            };
        }

        public async Task<JobDto> CreateJobAsync(CreateJobDto jobDto)
        {
            var job = new Job
            {
                Title = jobDto.Title,
                Description = jobDto.Description,
                CompanyName = jobDto.CompanyName,
                Location = jobDto.Location,
                Salary = jobDto.Salary,
                PostedAt = DateTime.Now,
                IsActive = true
            };

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            return await GetJobByIdAsync(job.Id);
        }

        public async Task<bool> DeleteJobAsync(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null) return false;

            job.IsActive = false;
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
