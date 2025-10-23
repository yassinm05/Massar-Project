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


        /// <summary>
        /// Gets a specific learning material that is a video.
        /// </summary>
        // [HttpGet("videos/{id}")]
        // //[Authorize] // JWT
        // public async Task<IActionResult> GetVideoMaterial(int id)
        // {
        //     // Call the new service method
        //     var material = await _service.GetVideoMaterialAsync(id);

        //     if (material == null)
        //         return NotFound();

        //     return Ok(material);
        // }

        // /// <summary>
        // /// Gets a specific learning material that is a document (e.g., PDF).
        // /// </summary>
        // [HttpGet("documents/{id}")]
        // //[Authorize] // JWT
        // public async Task<IActionResult> GetDocumentMaterial(int id)
        // {
        //     // Call the new service method
        //     var material = await _service.GetDocumentMaterialAsync(id);

        //     if (material == null)
        //         return NotFound();

        //     return Ok(material);
        // }

        // [HttpGet("{id}")]
        // //[Authorize] // JWT
        // public async Task<IActionResult> GetMaterial(int id)
        // {
        //     var material = await _service.GetMaterialAsync(id);

        //     if (material == null)
        //         return NotFound();

        //     return Ok(material);
        // }

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
    }
}
