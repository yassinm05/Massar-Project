using MasarSkills.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MasarSkills.API.Configuration
{
    public class LearningmaterialConfiguration : IEntityTypeConfiguration<LearningMaterial>
    {
        public void Configure(EntityTypeBuilder<LearningMaterial> builder)
        {
            builder.HasOne(lm => lm.Module)
                .WithMany(m => m.LearningMaterials)
                .HasForeignKey(lm => lm.ModuleId);

        }
    }
}
