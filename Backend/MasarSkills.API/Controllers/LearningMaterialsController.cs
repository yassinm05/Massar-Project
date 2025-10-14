using MasarSkills.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MasarSkills.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LearningMaterialsController : ControllerBase
    {
        private readonly ILearningMaterialService _service;

        public LearningMaterialsController(ILearningMaterialService service)
        {
            _service = service;
        }

        [HttpGet("{id}")]
        //[Authorize] // JWT
        public async Task<IActionResult> GetMaterial(int id)
        {
            var material = await _service.GetMaterialAsync(id);

            if (material == null)
                return NotFound();

            return Ok(material);
        }
    }
}
