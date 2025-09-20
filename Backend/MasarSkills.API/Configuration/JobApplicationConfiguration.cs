using MasarSkills.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MasarSkills.API.Configurations
{
    public class JobApplicationConfiguration : IEntityTypeConfiguration<JobApplication>
    {
        public void Configure(EntityTypeBuilder<JobApplication> builder)
        {
            builder.HasKey(ja => ja.Id);

            builder.HasOne(ja => ja.Job)
                   .WithMany()
                   .HasForeignKey(ja => ja.JobId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(ja => ja.User)
                   .WithMany(u => u.JobApplications)
                   .HasForeignKey(ja => ja.UserId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.Property(ja => ja.CoverLetter)
                   .HasMaxLength(500)
                   .IsRequired();
        }
    }
}
