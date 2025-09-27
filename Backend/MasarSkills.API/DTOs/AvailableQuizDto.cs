using System;

namespace MasarSkills.API.DTOs;

public class AvailableQuizDto
{
    public int QuizId { get; set; }
        public string QuizTitle { get; set; }
        public string CourseName { get; set; }
        public int TimeLimitMinutes { get; set; }
        public int MaxAttempts { get; set; }
        public int AttemptsTaken { get; set; }
}
