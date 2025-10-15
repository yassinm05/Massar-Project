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


        // POST: api/quiz/start/{quizId} this is to start a quiz attempt
        [HttpPost("start/{quizId}")]
        public async Task<IActionResult> StartQuiz(int quizId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            // Check if user is enrolled in the course
            var quiz = await _context.Quizzes
                .Include(q => q.Module.Course)
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
                .Where(q => q.Id == quizId)
                .Select(q => new QuizStartDto
                {
                    AttemptId = attempt.Id,
                    QuizId = q.Id,
                    QuizTitle = q.Title,
                    QuizDescription = q.Description,
                    PassingScore = q.PassingScore,
                    TotalScore = q.Questions.Sum(qq => qq.Points),
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
        // POST: api/quiz/submit-answer this is to submit each answer and get immediate feedback
        [HttpPost("submit-answer")]
        public async Task<IActionResult> SubmitAnswer([FromBody] SubmitAnswerDto submission)
        {
            // 1. Find the quiz attempt and ensure it's in progress
            var attempt = await _context.QuizAttempts.FirstOrDefaultAsync(qa => qa.Id == submission.AttemptId);

            if (attempt == null || attempt.Status != "InProgress")
            {
                return BadRequest("This quiz attempt is not valid or has already been completed.");
            }

            // 2. Find the question and its options
            var question = await _context.QuizQuestions
                .Include(q => q.Options)
                .FirstOrDefaultAsync(q => q.Id == submission.QuestionId);

            if (question == null)
            {
                return NotFound("Question not found.");
            }

            // 3. Determine if the selected answer is correct
            var correctOption = question.Options.FirstOrDefault(o => o.IsCorrect);
            if (correctOption == null)
            {
                // This indicates a data integrity issue; every question should have a correct answer.
                return StatusCode(500, "Question is missing a correct answer configuration.");
            }

            bool isCorrect = submission.SelectedOptionId == correctOption.Id;

            // 4. Create and save the answer record
            var quizAnswer = new QuizAnswer
            {
                QuizAttemptId = submission.AttemptId,
                QuestionId = submission.QuestionId,
                SelectedOptionId = submission.SelectedOptionId,
                TextAnswer = string.Empty,
                IsCorrect = isCorrect,
                PointsEarned = isCorrect ? question.Points : 0,
                AnsweredAt = DateTime.UtcNow
            };
            _context.QuizAnswers.Add(quizAnswer);

            // 5. Update the total score on the attempt record
            if (isCorrect)
            {
                attempt.Score += question.Points; // We will store raw points and calculate percentage later
            }

            await _context.SaveChangesAsync();

            // 6. Create the feedback response and send it back
            var feedback = new AnswerFeedbackDto
            {
                IsCorrect = isCorrect,
                CorrectOptionId = correctOption.Id,
                //Rationale = null, // You need to add this field to your Question model if you want to provide explanations
                UpdatedScore = attempt.Score
            };

            return Ok(feedback);
        }

        // POST: api/quiz/submit This is to submit the entire quiz at once we comment it for now
        /*[HttpPost("submit")]
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
        }*/

        // GET: api/quiz/results/{quizId}
        [HttpGet("results/{quizId}")]
        public async Task<IActionResult> GetQuizResults(int quizId)
        {
            // 1. Get the current user's ID
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            // 2. Find the latest COMPLETED attempt for this quiz by the current user
            var latestCompletedAttempt = await _context.QuizAttempts
                .Where(qa => qa.QuizId == quizId
                             && qa.Enrollment.StudentId == userId
                             && qa.Status == "Completed")
                .OrderByDescending(qa => qa.AttemptNumber) // Order to get the most recent attempt first
                .FirstOrDefaultAsync();

            // 3. If no completed attempt is found, return NotFound
            if (latestCompletedAttempt == null)
            {
                return NotFound("No completed quiz attempt found for this quiz.");
            }

            // 4. Now that we have the specific attempt, fetch its full details
            //    (This is the same logic as your original method, just using the ID we found)
            var results = await _context.QuizAttempts
                .Include(qa => qa.Quiz)
                .Include(qa => qa.Answers)
                .ThenInclude(a => a.Question)
                .Where(qa => qa.Id == latestCompletedAttempt.Id) // Use the ID of the attempt we found
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

            return Ok(results);
        }

        // POST: api/quiz/finish/{attemptId} this is to finalize the quiz attempt
        [HttpPost("finish/{attemptId}")]
        public async Task<IActionResult> FinishQuiz(int attemptId)
        {
            // 1. Find the quiz attempt
            var attempt = await _context.QuizAttempts
                .Include(a => a.Quiz) // Include Quiz to get PassingScore
                .FirstOrDefaultAsync(qa => qa.Id == attemptId);

            if (attempt == null || attempt.Status != "InProgress")
            {
                return BadRequest("This quiz attempt is not valid or has already been completed.");
            }

            // 2. Finalize the attempt
            attempt.EndTime = DateTime.UtcNow;
            attempt.Status = "Completed";

            await _context.SaveChangesAsync();

            // 3. Calculate final results and return a summary
            // First, get the total possible points for this quiz
            decimal maxScore = await _context.QuizQuestions
                .Where(q => q.QuizId == attempt.QuizId)
                .SumAsync(q => q.Points);

            // Calculate the score as a percentage
            decimal finalPercentage = (maxScore > 0) ? (attempt.Score / maxScore) * 100 : 0;
            attempt.Score = finalPercentage; // Update the score to be the percentage

            await _context.SaveChangesAsync();


            var result = new QuizResultDto
            {
                AttemptId = attempt.Id,
                Score = attempt.Score,
                IsPassed = attempt.Score >= attempt.Quiz.PassingScore,
                // You can add more summary details here if needed
            };

            return Ok(result);
        }
        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableQuizzes()
        {
            if (!int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var userId))
            {
                return Unauthorized();
            }

            var studentQuizzes = await _context.CourseEnrollments
         .Where(ce => ce.StudentId == userId)
         .SelectMany(ce => ce.Course.Modules.SelectMany(m => m.Quizzes))
                .Select(q => new
                {
                    Quiz = q,
                    CourseName = q.Module.Course.Title,
                    LatestAttempt = _context.QuizAttempts
                        .Where(qa => qa.QuizId == q.Id && qa.Enrollment.StudentId == userId)
                        .OrderByDescending(qa => qa.AttemptNumber)
                        .FirstOrDefault()
                })
                .ToListAsync();

            var availableQuizzes = studentQuizzes.Select(x => new AvailableQuizDto
            {
                QuizId = x.Quiz.Id,
                // If LatestAttempt is null, its Id is null. The '?? 0' replaces that null with 0.
                LatestAttemptId = x.LatestAttempt?.Id ?? 0, // <-- MODIFIED THIS LINE
                QuizTitle = x.Quiz.Title,
                CourseName = x.CourseName,
                TimeLimitMinutes = x.Quiz.TimeLimitMinutes,
                MaxAttempts = x.Quiz.MaxAttempts,
                AttemptsTaken = x.LatestAttempt?.AttemptNumber ?? 0,
                Status = x.LatestAttempt?.Status ?? "Not Started"
            }).ToList();

            return Ok(availableQuizzes);
        }
    }


    public class QuizStartDto
    {
        public int AttemptId { get; set; }
        public int QuizId { get; set; }
        public string QuizTitle { get; set; }
        public string QuizDescription { get; set; }
        public decimal PassingScore { get; set; }
        public int TotalScore { get; set; }
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
    // DTO for receiving an answer from the client
    public class SubmitAnswerDto
    {
        public int AttemptId { get; set; }
        public int QuestionId { get; set; }
        public int SelectedOptionId { get; set; }
    }

    // DTO for sending feedback back to the client
    public class AnswerFeedbackDto
    {
        public bool IsCorrect { get; set; }
        public int CorrectOptionId { get; set; }
        //public string Rationale { get; set; } // The explanation for the answer
        public decimal UpdatedScore { get; set; } // The new cumulative score
    }

}