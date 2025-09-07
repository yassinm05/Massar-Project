using MasarSkills.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Reflection.Emit;

namespace MasarSkills.API.Configuration
{
    public class CourseEnrollmentConfiguration : IEntityTypeConfiguration<CourseEnrollment>
    {
        public void Configure(EntityTypeBuilder<CourseEnrollment> builder)
        {
            builder.HasIndex(ce => new { ce.StudentId, ce.CourseId }).IsUnique();

            builder.HasOne(ce => ce.Student)
                .WithMany(u => u.CourseEnrollments)
                .HasForeignKey(u => u.StudentId);

            builder.HasOne(ce => ce.Course)
                .WithMany(c => c.Enrollments)
                .HasForeignKey(cw => cw.CourseId);


            builder.Property(e => e.FinalGrade)
            .HasPrecision(5, 2);

            builder.Property(e => e.ProgressPercentage)
                .HasPrecision(5, 2);

        }
    }
}
