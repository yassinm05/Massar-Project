using MasarSkills.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MasarSkills.API.Configuration
{
    public class CourseModelConfiguration : IEntityTypeConfiguration<CourseModule>
    {
        public void Configure(EntityTypeBuilder<CourseModule> builder)
        {
            builder.HasOne(cm => cm.Course)
                .WithMany(c => c.Modules)
                .HasForeignKey(cm => cm.CourseId);

        }
    }
}
