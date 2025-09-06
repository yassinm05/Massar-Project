using MasarSkills.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MasarSkills.API.Configuration
{
    public class AdminProfileConfiguration : IEntityTypeConfiguration<AdminProfile>
    {
        public void Configure(EntityTypeBuilder<AdminProfile> builder)
        {
            builder.HasOne(a => a.User)
                    .WithOne(u => u.AdminProfile)
                    .HasForeignKey<AdminProfile>(a => a.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
