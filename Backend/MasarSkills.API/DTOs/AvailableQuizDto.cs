using System;

namespace MasarSkills.API.DTOs;

public class AvailableQuizDto
{
    public int QuizId { get; set; }
    public int LatestAttemptId { get; set; } // Changed from int? to int
    public string QuizTitle { get; set; }
    public string CourseName { get; set; }
    public int TimeLimitMinutes { get; set; }
    public int MaxAttempts { get; set; }
    public int AttemptsTaken { get; set; }
    public string Status { get; set; }

    public string ImagePath { get; set; }
}
