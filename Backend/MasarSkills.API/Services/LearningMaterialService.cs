using MasarSkills.API.Data;
using MasarSkills.API.DTOs;
using MasarSkills.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MasarSkills.API.Services;

public class LearningMaterialService : ILearningMaterialService
    {
        private readonly ApplicationDbContext _context;

        public LearningMaterialService(ApplicationDbContext context)
        {
            _context = context;
        }

        //helper method to convert material type enum to string
        private string ConvertMaterialTypeToString(MaterialType type)
        {
            // Cast the enum to an int to compare against 0 and 1
            switch ((int)type)
            {
                case 0:
                    return "Video";
                case 1:
                    return "Document";
                default:
                    return "Unknown";
            }
        }

        public async Task<List<LearningMaterialDto>> GetAllMaterialsForModuleAsync(int moduleId)
        {
            // 1. Get the list of raw objects from the database
            var materials = await _context.LearningMaterials
                .Where(m => m.ModuleId == moduleId)
                .OrderBy(m => m.Order) // Order by the 'Order' column
                .ToListAsync();

            // 2. Map the list to a list of DTOs in C# memory
            return materials.Select(material => new LearningMaterialDto
            {
                Id = material.Id,
                Title = material.Title,
                Description = material.Description,
                ContentUrl = material.ContentUrl,
                Type = ConvertMaterialTypeToString(material.Type),
                DurationMinutes = material.DurationMinutes,
                IsPreview = material.IsPreview
            }).ToList();
        }

        public async Task<List<LearningMaterialDto>> GetVideosForModuleAsync(int moduleId)
        {
            // 1. Get the list of raw objects from the database
            var materials = await _context.LearningMaterials
                .Where(m => m.ModuleId == moduleId && m.Type == MaterialType.Video)
                .OrderBy(m => m.Order) // Order by the 'Order' column
                .ToListAsync();

            // 2. Map the list to a list of DTOs in C# memory
            return materials.Select(material => new LearningMaterialDto
            {
                Id = material.Id,
                Title = material.Title,
                Description = material.Description,
                ContentUrl = material.ContentUrl,
                Type = ConvertMaterialTypeToString(material.Type),
                DurationMinutes = material.DurationMinutes,
                IsPreview = material.IsPreview
            }).ToList();
        }

    public async Task<List<LearningMaterialDto>> GetDocumentsForModuleAsync(int moduleId)
    {
        // 1. Get the list of raw objects from the database
        var materials = await _context.LearningMaterials
            .Where(m => m.ModuleId == moduleId && m.Type == (MaterialType)1)
            .OrderBy(m => m.Order)
            .ToListAsync();


        // 2. Map the list to a list of DTOs in C# memory
        return materials.Select(material => new LearningMaterialDto
        {
            Id = material.Id,
            Title = material.Title,
            Description = material.Description,
            ContentUrl = material.ContentUrl,
            Type = ConvertMaterialTypeToString(material.Type),
            DurationMinutes = material.DurationMinutes,
            IsPreview = material.IsPreview
        }).ToList();
    }
        
        public async Task<LearningMaterialDto> GetMaterialByIdAsync(int id)
    {
        var material = await _context.LearningMaterials.FindAsync(id);

        if (material == null)
        {
            return null; // Controller will handle this as a 404 Not Found
        }

        // Map the entity to the DTO
        return new LearningMaterialDto
        {
            Id = material.Id,
            Title = material.Title,
            Description = material.Description,
            ContentUrl = material.ContentUrl, // This is the relative path
            Type = ConvertMaterialTypeToString(material.Type),
            DurationMinutes = material.DurationMinutes,
            IsPreview = material.IsPreview
        };
    }
    }