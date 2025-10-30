using MasarSkills.API.Data;
using MasarSkills.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace MasarSkills.API.Services
{
    public class QuizAnalysisService
    {
        private readonly ApplicationDbContext _context;

        public QuizAnalysisService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<QuizAnalysisResult> AnalyzeQuizResultsAsync(int studentId, int quizId)
        {
            // Step 1: Find the latest quiz attempt for the student and quiz.
            var quizAttempt = await _context.QuizAttempts
                .Where(a => a.StudentId == studentId && a.QuizId == quizId)
                .OrderByDescending(a => a.AttemptDate)
                .FirstOrDefaultAsync();

            if (quizAttempt == null)
            {
                // No attempt found, return null or an empty result
                return null; 
            }

            // Step 2 & 3: Retrieve all student answers for the specific quiz attempt and group by topic.
            // We use .Include() to Eager Load the related data (Question and Topic) to avoid N+1 queries.
            var topicAnalysis = await _context.QuizAnswers
                .Where(a => a.QuizAttemptId == quizAttempt.Id)
                .Include(a => a.Question)
                .ThenInclude(q => q.Topic)
                .GroupBy(a => new { a.Question.TopicId, a.Question.Topic.TopicName })
                .Select(g => new TopicAnalysis
                {
                    TopicName = g.Key.TopicName,
                    TotalQuestions = g.Count(),
                    CorrectAnswers = g.Count(a => a.IsCorrect),
                    Score = (double)g.Count(a => a.IsCorrect) / g.Count() * 100
                })
                .ToListAsync();

            // Step 4: Calculate the overall performance for the entire quiz.
            var totalQuestions = topicAnalysis.Sum(ta => ta.TotalQuestions);
            var totalCorrectAnswers = topicAnalysis.Sum(ta => ta.CorrectAnswers);
            var overallScore = totalQuestions > 0 ? (double)totalCorrectAnswers / totalQuestions * 100 : 0;
            
            // Create the final result object
            var result = new QuizAnalysisResult
            {
                OverallScore = overallScore,
                TopicAnalysis = topicAnalysis,
                QuizAttemptId = quizAttempt.Id
            };

            return result;
        }
    }
}
