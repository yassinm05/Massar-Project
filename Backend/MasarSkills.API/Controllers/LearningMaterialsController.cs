using MasarSkills.API.DTOs;
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
        [HttpGet("videos/for-module/{moduleId}")]
        public async Task<IActionResult> GetVideosForModule(int moduleId)
        {
            // This returns a List<LearningMaterialDto>
            // If no materials are found, it will correctly return an empty list []
            var materials = await _service.GetVideosForModuleAsync(moduleId);
            return Ok(materials);
        }

        [HttpGet("documents/for-module/{moduleId}")]
        public async Task<IActionResult> GetDocumentsForModule(int moduleId)
        {
            // This returns a List<LearningMaterialDto>
            var materials = await _service.GetDocumentsForModuleAsync(moduleId);
            return Ok(materials);
        }

        [HttpGet("all/for-module/{moduleId}")]
        public async Task<IActionResult> GetAllMaterialsForModule(int moduleId)
        {
            // Bonus: An endpoint to get ALL materials (videos and documents) for a module
            var materials = await _service.GetAllMaterialsForModuleAsync(moduleId);
            return Ok(materials);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMaterialById(int id)
        {
            var material = await _service.GetMaterialByIdAsync(id);
            if (material == null)
            {
                return NotFound();
            }

            // Fix the URL
            FixMaterialUrl(material);

            return Ok(material);
        }

        private void FixMaterialUrl(LearningMaterialDto material)
        {
            if (material == null || string.IsNullOrEmpty(material.ContentUrl))
                return;

            // Check if it's a relative path (starts with /)
            // This prevents adding the baseUrl to an external URL (like YouTube)
            if (material.ContentUrl.StartsWith("/"))
            {
                var baseUrl = $"{Request.Scheme}://{Request.Host}";
                material.ContentUrl = baseUrl + material.ContentUrl;
            }
        }
    }
}
