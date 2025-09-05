using MasarSkills.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MasarSkills.API.Configuration
{
    public class QuizAnswerConfiguartion : IEntityTypeConfiguration<QuizAnswer>
    {
        public void Configure(EntityTypeBuilder<QuizAnswer> builder)
        {
            builder.HasOne(q => q.QuizAttempt)
                .WithMany(q => q.Answers)
                .HasForeignKey(q => q.QuizAttemptId);
            builder.HasOne(q => q.Question)
                .WithMany(q => q.QuizAnswers)
                .HasForeignKey(q => q.QuestionId);
            builder.HasOne(q => q.SelectedOption)
                .WithMany(q => q.QuizAnswers)
                .HasForeignKey(q => q.SelectedOptionId);
        }
    }
}
