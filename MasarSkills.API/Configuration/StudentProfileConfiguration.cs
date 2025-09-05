using MasarSkills.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MasarSkills.API.Configuration
{
    public class StudentProfileConfiguratio : IEntityTypeConfiguration<StudentProfile>
    {
        public void Configure(EntityTypeBuilder<StudentProfile> builder)
        {
            builder.HasOne(s => s.User)
                .WithOne(u => u.StudentProfile)
                .HasForeignKey<StudentProfile>(s => s.UserId);
        }
    }
}
