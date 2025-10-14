using MasarSkills.API.DTOs;
using MasarSkills.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace MasarSkills.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AIQueryController : ControllerBase
    {
        private readonly ILearningMaterialQAService _materialQAService;
        private readonly IAiQueryService _aiQueryService;
        private readonly ILogger<AIQueryController> _logger;

        public AIQueryController(
            ILearningMaterialQAService materialQAService,
            IAiQueryService aiQueryService,
            ILogger<AIQueryController> logger)
        {
            _materialQAService = materialQAService;
            _aiQueryService = aiQueryService;
            _logger = logger;
        }

        [HttpPost("ask")]
        public async Task<IActionResult> AskQuestion([FromBody] AIQueryDto query)
        {
            // Step 1: Use our first service to get the context from the file.
            _logger.LogInformation("Getting context for material ID: {MaterialId}", query.MaterialId);
            var context = await _materialQAService.GetContextFromMaterialAsync(query.MaterialId);

            if (string.IsNullOrWhiteSpace(context))
            {
                _logger.LogWarning("No context found for material ID: {MaterialId}. The file might be missing, empty, or of an unsupported type.", query.MaterialId);
                return NotFound("The learning material could not be found or processed.");
            }

            // Step 2: Use our second service to get the answer from the AI.
            _logger.LogInformation("Sending question to AI: '{Question}'", query.Question);
            var answer = await _aiQueryService.GetAnswerFromAiAsync(context, query.Question);

            if (string.IsNullOrWhiteSpace(answer))
            {
                return StatusCode(502, "The AI service failed to provide an answer. Please try again later."); // 502 Bad Gateway
            }

            // Step 3: Return the final answer to the client.
            return Ok(new { Answer = answer });
        }
    }
}
