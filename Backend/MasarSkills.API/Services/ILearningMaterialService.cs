using MasarSkills.API.Data;
using MasarSkills.API.DTOs;
//using MasarSkills.API.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace MasarSkills.API.Services
{
    public interface ILearningMaterialService
    {
        Task<LearningMaterialDto?> GetMaterialAsync(int id);
    }

    public class LearningMaterialService : ILearningMaterialService
    {
        private readonly ApplicationDbContext _context;

        public LearningMaterialService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<LearningMaterialDto?> GetMaterialAsync(int id)
        {
            return await _context.LearningMaterials
                .Where(m => m.Id == id)
                .Select(m => new LearningMaterialDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    Description = m.Description,
                    ContentUrl = m.ContentUrl,
                    Type = m.Type.ToString(),
                    DurationMinutes = m.DurationMinutes,
                    IsPreview = m.IsPreview
                })
                .FirstOrDefaultAsync();
        }
    }
}
