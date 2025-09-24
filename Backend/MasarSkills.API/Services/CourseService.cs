using MasarSkills.API.Data;
using MasarSkills.API.DTOs;
using MasarSkills.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MasarSkills.API.Services
{
    public class CourseService:ICourseService
    {
        private readonly ApplicationDbContext _context;

        public CourseService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CourseDto>> GetAllCoursesAsync()
        {
            var courses = await _context.Courses
                .Include(c => c.Instructor)
                .ThenInclude(i => i.User)
                .Where(c => c.IsActive)
                .ToListAsync();

            return courses.Select(c => new CourseDto
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                Price = c.Price,
                DurationHours = c.DurationHours,
                Difficulty = c.Difficulty,
                ThumbnailUrl = c.ThumbnailUrl,
                InstructorName = $"{c.Instructor.User.FirstName} {c.Instructor.User.LastName}",
                CreatedAt = c.CreatedAt
            });
        }

        public async Task<CourseDto> GetCourseByIdAsync(int id)
        {
            var course = await _context.Courses
                .Include(c => c.Instructor)
                .ThenInclude(i => i.User)
                .FirstOrDefaultAsync(c => c.Id == id && c.IsActive);

            if (course == null) return null;

            return new CourseDto
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                Price = course.Price,
                Difficulty = course.Difficulty,
                DurationHours = course.DurationHours,
                ThumbnailUrl = course.ThumbnailUrl,
                InstructorName = $"{course.Instructor.User.FirstName} {course.Instructor.User.LastName}",
                CreatedAt = course.CreatedAt
            };
        }

        public async Task<CourseDto> CreateCourseAsync(CreateCourseDto courseDto)
        {
            var course = new Course
            {
                Title = courseDto.Title,
                Description = courseDto.Description,
                Price = courseDto.Price,
                DurationHours = courseDto.DurationHours,
                ThumbnailUrl = courseDto.ThumbnailUrl,
                Difficulty = courseDto.Difficulty,
                InstructorId = courseDto.InstructorId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return await GetCourseByIdAsync(course.Id);
        }

        public async Task<bool> UpdateCourseAsync(int id, CreateCourseDto courseDto)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return false;

            course.Title = courseDto.Title;
            course.Description = courseDto.Description;
            course.Price = courseDto.Price;
            course.DurationHours = courseDto.DurationHours;
            course.ThumbnailUrl = courseDto.ThumbnailUrl;
            course.Difficulty = courseDto.Difficulty;
            course.InstructorId = courseDto.InstructorId;
            course.UpdatedAt = DateTime.UtcNow;

            _context.Courses.Update(course);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteCourseAsync(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return false;

            course.IsActive = false;
            course.UpdatedAt = DateTime.UtcNow;

            _context.Courses.Update(course);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}

