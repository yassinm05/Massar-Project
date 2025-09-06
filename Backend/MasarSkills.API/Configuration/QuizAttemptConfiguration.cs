using MasarSkills.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Reflection.Emit;

namespace MasarSkills.API.Configuration
{
    public class QuizAttemptConfiguration : IEntityTypeConfiguration<QuizAttempt>
    {
        public void Configure(EntityTypeBuilder<QuizAttempt> builder)
        {
            builder.HasIndex(q => new { q.EnrollmentId, q.QuizId, q.AttemptNumber }).IsUnique();
            builder.HasOne(q => q.Enrollment)
                .WithMany(q => q.QuizAttempts)
                .HasForeignKey(q => q.EnrollmentId);
            builder.HasOne(q => q.Quiz)
                .WithMany(q => q.Attempts)
                .HasForeignKey(q => q.QuizId);

            builder.Property(q => q.Score)
            .HasPrecision(5, 2);

        }
    }
}
