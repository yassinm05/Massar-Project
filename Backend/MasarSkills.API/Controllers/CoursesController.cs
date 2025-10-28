using MasarSkills.API.DTOs;
using MasarSkills.API.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MasarSkills.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoursesController : ControllerBase
    {
        private readonly ICourseService _courseService;

        public CoursesController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        // GET: api/courses
        [HttpGet]
public async Task<IActionResult> GetAllCourses()
{
    var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    int? userId = int.TryParse(userIdString, out var id) ? id : (int?)null;
    
    // 1. Get courses AND convert the "plan" (IEnumerable) into a "real list" (List)
    var courses = (await _courseService.GetAllCoursesAsync(userId)).ToList(); // <-- ADD .ToList() HERE

    // 2. Get your server's base URL
    var baseUrl = $"{Request.Scheme}://{Request.Host}";

    // 3. Fix the ImagePath for every course (this now modifies the items in the real list)
    foreach (var course in courses)
    {
        if (!string.IsNullOrEmpty(course.ImagePaths))
        {
            course.ImagePaths = baseUrl + course.ImagePaths;
        }
    }

    // 4. Return the modified list
    return Ok(courses);
}

// GET: api/courses/{id}
[HttpGet("{id}")]
public async Task<IActionResult> GetCourse(int id)
{
    // 1. Get the course from the service (it has a relative path)
    var course = await _courseService.GetCourseByIdAsync(id);

    if (course == null)
        return NotFound();

    // 2. Fix the ImagePath for the single course
    if (!string.IsNullOrEmpty(course.ImagePaths))
    {
        // 3. Get your server's base URL
        var baseUrl = $"{Request.Scheme}://{Request.Host}";
        course.ImagePaths = baseUrl + course.ImagePaths;
    }

    // 4. Return the modified course
    return Ok(course);
}
        // POST: api/courses
        [HttpPost]
        public async Task<IActionResult> CreateCourse([FromBody] CreateCourseDto courseDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // ✅ هتكون فيها Difficulty دلوقتي
            var course = await _courseService.CreateCourseAsync(courseDto);
            return CreatedAtAction(nameof(GetCourse), new { id = course.Id }, course);
        }

        // PUT: api/courses/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCourse(int id, [FromBody] CreateCourseDto courseDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _courseService.UpdateCourseAsync(id, courseDto);

            if (!result)
                return NotFound();

            return NoContent();
        }

        // DELETE: api/courses/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var result = await _courseService.DeleteCourseAsync(id);

            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}
