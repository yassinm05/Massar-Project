using System;

namespace MasarSkills.API.Models;


public class QuizAnalysisResult
{
    public int QuizAttemptId { get; set; }
    public double OverallScore { get; set; }
    public List<TopicAnalysis> TopicAnalysis { get; set; } = new List<TopicAnalysis>();
}
public class TopicAnalysis
{
    public string TopicName { get; set; }
    public int TotalQuestions { get; set; }
    public int CorrectAnswers { get; set; }
    public double Score { get; set; }
}