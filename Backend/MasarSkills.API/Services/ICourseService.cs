using MasarSkills.API.DTOs;

namespace MasarSkills.API.Services
{
    public interface ICourseService
    {
        Task<IEnumerable<CourseDto>> GetAllCoursesAsync(int? userId);
        Task<CourseDto> GetCourseByIdAsync(int id);
        Task<CourseDto> CreateCourseAsync(CreateCourseDto courseDto);
        Task<bool> UpdateCourseAsync(int id, CreateCourseDto courseDto);
        Task<bool> DeleteCourseAsync(int id);
    }
}
