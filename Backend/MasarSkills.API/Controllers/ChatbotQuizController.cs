using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MasarSkills.API.Data;
using MasarSkills.API.Models;
using MasarSkills.API.Services;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace MasarSkills.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatbotQuizController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly QuizAnalysisService _quizAnalysisService;

        public ChatbotQuizController(ApplicationDbContext context, QuizAnalysisService quizAnalysisService)
        {
            _context = context;
            _quizAnalysisService = quizAnalysisService;
        }

        [HttpGet("analyze/{studentId}/{quizId}")]
        public async Task<ActionResult<object>> AnalyzeQuiz(int studentId, int quizId)
        {
            if (studentId <= 0 || quizId <= 0)
            {
                return BadRequest(new { message = "Invalid student ID or quiz ID." });
            }

            // Call the service to get the raw analysis data
            var analysisResult = await _quizAnalysisService.AnalyzeQuizResultsAsync(studentId, quizId);

            if (analysisResult == null)
            {
                return NotFound(new { message = "Quiz attempt not found for this student." });
            }

            // Step 1: Get the overall score
            var overallScore = analysisResult.OverallScore;
            
            // Step 2: Categorize topics into strengths and weaknesses
            var strengths = analysisResult.TopicAnalysis
                                          .Where(t => t.Score >= 85) // Define your strength threshold
                                          .Select(t => t.TopicName)
                                          .ToList();

            var weaknesses = analysisResult.TopicAnalysis
                                           .Where(t => t.Score < 70) // Define your weakness threshold
                                           .Select(t => t.TopicName)
                                           .ToList();

            // Step 3: Prepare the final structured JSON object for the chatbot
            var formattedResult = new
            {
                OverallScore = overallScore,
                TopicPerformance = analysisResult.TopicAnalysis.Select(t => new { name = t.TopicName, score = t.Score }),
                Strengths = strengths,
                AreasForImprovement = weaknesses
            };

            return Ok(formattedResult);
        }
    }
}

