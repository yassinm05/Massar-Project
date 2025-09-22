using System;

namespace MasarSkills.API.Models;

public class Topics
{
    public int Id { get; set; }
    public string TopicName { get; set; }
    
    // Navigation property for related questions
    public virtual ICollection<QuizQuestion> QuizQuestions { get; set; }

}
