using MasarSkills.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MasarSkills.API.Configuration
{
    public class InstructorprofileConfiguration : IEntityTypeConfiguration<InstructorProfile>
    {
        public void Configure(EntityTypeBuilder<InstructorProfile> builder)
        {
            builder.HasOne(i => i.User)
                .WithOne(u => u.InstructorProfile)
                .HasForeignKey<InstructorProfile>(i => i.UserId);
        }
    }
}
