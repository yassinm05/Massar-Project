using MasarSkills.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MasarSkills.API.Configuration
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasIndex(u => u.Email).IsUnique();

            builder.HasOne(u => u.StudentProfile)
                .WithOne(s => s.User)
                .HasForeignKey<StudentProfile>(s => s.UserId);

            builder.HasOne(u => u.InstructorProfile)
                .WithOne(i => i.User)
                .HasForeignKey<InstructorProfile>(i => i.UserId);


            builder.HasIndex(u => u.Email).IsUnique();
            builder.HasIndex(u => u.PaymentId).IsUnique().HasFilter("[PaymentId] IS NOT NULL");


            builder.HasOne(u => u.StudentProfile)
                   .WithOne(s => s.User)
                   .HasForeignKey<StudentProfile>(s => s.UserId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(u => u.InstructorProfile)
                    .WithOne(i => i.User)
                    .HasForeignKey<InstructorProfile>(i => i.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(u => u.AdminProfile)
                   .WithOne(a => a.User)
                   .HasForeignKey<AdminProfile>(a => a.UserId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
