using System;

namespace MasarSkills.API.Services;

public interface ILearningMaterialQAService
{
    Task<string?> GetContextFromMaterialAsync(int materialId);
}
