using Microsoft.AspNetCore.Mvc;
using MasarSkills.API.Data;
using MasarSkills.API.Models;
using MasarSkills.API.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MasarSkills.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public QuizController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/quiz/start/{quizId}
        [HttpPost("start/{quizId}")]
        public async Task<IActionResult> StartQuiz(int quizId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            // Check if user is enrolled in the course
            var quiz = await _context.Quizzes
                .Include(q => q.Module)
                .ThenInclude(m => m.Course)
                .FirstOrDefaultAsync(q => q.Id == quizId);

            if (quiz == null)
            {
                return NotFound("Quiz not found");
            }

            var enrollment = await _context.CourseEnrollments
                .FirstOrDefaultAsync(ce => ce.StudentId == userId && ce.CourseId == quiz.Module.CourseId);

            if (enrollment == null)
            {
                return BadRequest("You are not enrolled in this course");
            }

            // Check previous attempts
            var previousAttempts = await _context.QuizAttempts
                .Where(qa => qa.EnrollmentId == enrollment.Id && qa.QuizId == quizId)
                .CountAsync();

            if (previousAttempts >= quiz.MaxAttempts)
            {
                return BadRequest("You have exceeded the maximum number of attempts");
            }

            // Create new quiz attempt
            var attempt = new QuizAttempt
            {
                EnrollmentId = enrollment.Id,
                QuizId = quizId,
                StartTime = DateTime.UtcNow,
                Score = 0,
                AttemptNumber = previousAttempts + 1,
                Status = "InProgress"
            };

            _context.QuizAttempts.Add(attempt);
            await _context.SaveChangesAsync();

            // Get quiz questions with options
            var quizDetails = await _context.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(q => q.Options)
                .Where(q => q.Id == quizId)
                .Select(q => new QuizStartDto
                {
                    QuizId = q.Id,
                    QuizTitle = q.Title,
                    QuizDescription = q.Description,
                    TimeLimitMinutes = q.TimeLimitMinutes,
                    AttemptNumber = attempt.AttemptNumber,
                    Questions = q.Questions.OrderBy(qq => qq.Order).Select(qq => new QuizQuestionDto
                    {
                        QuestionId = qq.Id,
                        QuestionText = qq.QuestionText,
                        QuestionType = qq.QuestionType,
                        Points = qq.Points,
                        Options = qq.Options.OrderBy(o => o.Order).Select(o => new QuestionOptionDto
                        {
                            OptionId = o.Id,
                            OptionText = o.OptionText
                        }).ToList()
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            return Ok(quizDetails);
        }

        // POST: api/quiz/submit
        [HttpPost("submit")]
        public async Task<IActionResult> SubmitQuiz([FromBody] QuizSubmissionDto submission)
        {
            var attempt = await _context.QuizAttempts
                .Include(qa => qa.Quiz)
                .FirstOrDefaultAsync(qa => qa.Id == submission.AttemptId);

            if (attempt == null || attempt.Status != "InProgress")
            {
                return BadRequest("Invalid quiz attempt");
            }

            // Calculate score
            decimal totalScore = 0;
            decimal maxScore = 0;

            foreach (var answer in submission.Answers)
            {
                var question = await _context.QuizQuestions
                    .Include(q => q.Options)
                    .FirstOrDefaultAsync(q => q.Id == answer.QuestionId);

                if (question != null)
                {
                    maxScore += question.Points;

                    if (question.QuestionType == "MultipleChoice")
                    {
                        var selectedOption = question.Options.FirstOrDefault(o => o.Id == answer.SelectedOptionId);
                        if (selectedOption != null && selectedOption.IsCorrect)
                        {
                            totalScore += question.Points;
                        }
                    }
                    // Add logic for other question types

                    // Save each answer
                    var quizAnswer = new QuizAnswer
                    {
                        QuizAttemptId = attempt.Id,
                        QuestionId = answer.QuestionId,
                        SelectedOptionId = answer.SelectedOptionId,
                        TextAnswer = answer.TextAnswer,
                        IsCorrect = question.QuestionType == "MultipleChoice" ?
                                   question.Options.First(o => o.Id == answer.SelectedOptionId).IsCorrect : false,
                        PointsEarned = question.QuestionType == "MultipleChoice" &&
                                      question.Options.First(o => o.Id == answer.SelectedOptionId).IsCorrect ?
                                      question.Points : 0,
                        AnsweredAt = DateTime.UtcNow
                    };

                    _context.QuizAnswers.Add(quizAnswer);
                }
            }

            // Update attempt
            attempt.Score = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
            attempt.EndTime = DateTime.UtcNow;
            attempt.Status = "Completed";

            await _context.SaveChangesAsync();

            return Ok(new QuizResultDto
            {
                AttemptId = attempt.Id,
                Score = attempt.Score,
                TotalQuestions = submission.Answers.Count,
                CorrectAnswers = (int)(totalScore / (maxScore > 0 ? maxScore / submission.Answers.Count : 1)),
                IsPassed = attempt.Score >= attempt.Quiz.PassingScore
            });
        }

        // GET: api/quiz/results/{attemptId}
        [HttpGet("results/{attemptId}")]
        public async Task<IActionResult> GetQuizResults(int attemptId)
        {
            var results = await _context.QuizAttempts
                .Include(qa => qa.Quiz)
                .Include(qa => qa.Answers)
                .ThenInclude(a => a.Question)
                .Where(qa => qa.Id == attemptId)
                .Select(qa => new QuizDetailedResultDto
                {
                    AttemptId = qa.Id,
                    QuizTitle = qa.Quiz.Title,
                    Score = qa.Score,
                    PassingScore = qa.Quiz.PassingScore,
                    IsPassed = qa.Score >= qa.Quiz.PassingScore,
                    StartTime = qa.StartTime,
                    EndTime = qa.EndTime,
                    TimeTaken = qa.EndTime.HasValue ? (qa.EndTime.Value - qa.StartTime).TotalMinutes : 0,
                    Questions = qa.Answers.Select(a => new QuestionResultDto
                    {
                        QuestionId = a.QuestionId,
                        QuestionText = a.Question.QuestionText,
                        IsCorrect = a.IsCorrect,
                        PointsEarned = a.PointsEarned
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (results == null)
            {
                return NotFound();
            }

            return Ok(results);
        }
    }

    public class QuizStartDto
    {
        public int QuizId { get; set; }
        public string QuizTitle { get; set; }
        public string QuizDescription { get; set; }
        public int TimeLimitMinutes { get; set; }
        public int AttemptNumber { get; set; }
        public List<QuizQuestionDto> Questions { get; set; }
    }

    public class QuizQuestionDto
    {
        public int QuestionId { get; set; }
        public string QuestionText { get; set; }
        public string QuestionType { get; set; }
        public int Points { get; set; }
        public List<QuestionOptionDto> Options { get; set; }
    }

    public class QuestionOptionDto
    {
        public int OptionId { get; set; }
        public string OptionText { get; set; }
    }

    public class QuizSubmissionDto
    {
        public int AttemptId { get; set; }
        public List<QuizAnswerDto> Answers { get; set; }
    }

    public class QuizAnswerDto
    {
        public int QuestionId { get; set; }
        public int? SelectedOptionId { get; set; }
        public string TextAnswer { get; set; }
    }

    public class QuizResultDto
    {
        public int AttemptId { get; set; }
        public decimal Score { get; set; }
        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public bool IsPassed { get; set; }
    }

    public class QuizDetailedResultDto
    {
        public int AttemptId { get; set; }
        public string QuizTitle { get; set; }
        public decimal Score { get; set; }
        public decimal PassingScore { get; set; }
        public bool IsPassed { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public double TimeTaken { get; set; }
        public List<QuestionResultDto> Questions { get; set; }
    }

    public class QuestionResultDto
    {
        public int QuestionId { get; set; }
        public string QuestionText { get; set; }
        public bool IsCorrect { get; set; }
        public decimal PointsEarned { get; set; }
    }
}