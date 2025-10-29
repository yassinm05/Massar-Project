using MasarSkills.API.Data;
using MasarSkills.API.DTOs;
using MasarSkills.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MasarSkills.API.Services
{
    public interface ILearningMaterialService
    {
        Task<List<LearningMaterialDto>> GetAllMaterialsForModuleAsync(int moduleId);
        Task<List<LearningMaterialDto>> GetVideosForModuleAsync(int moduleId);
        Task<List<LearningMaterialDto>> GetDocumentsForModuleAsync(int moduleId);
        Task<LearningMaterialDto> GetMaterialByIdAsync(int id);
    }
}
