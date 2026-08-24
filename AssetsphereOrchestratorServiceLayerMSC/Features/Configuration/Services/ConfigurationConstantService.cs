using AssetsphereOrchestratorServiceLayerMSC.Data;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.Configuration.Services;

public sealed class ConfigurationConstantService
{
    private readonly AssetsphereDbContext _context;

    public ConfigurationConstantService(AssetsphereDbContext context)
    {
        _context = context;
    }

    public async Task<List<ConfigurationConstantResponseDTO>> GetAllConstantsAsync()
    {
        List<ConfigurationConstantEntityClass> entities = await _context.ConfigurationConstants
            .AsNoTracking()
            .Where(c => !c.IsDeleted)
            .OrderBy(c => c.ConfigurationKey)
            .ToListAsync();

        return entities.Select(MapToDTO).ToList();
    }

    public async Task<ConfigurationConstantResponseDTO?> GetConstantByKeyAsync(string key)
    {
        ConfigurationConstantEntityClass? entity = await _context.ConfigurationConstants
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.ConfigurationKey == key && !c.IsDeleted);

        return entity == null ? null : MapToDTO(entity);
    }

    private static ConfigurationConstantResponseDTO MapToDTO(ConfigurationConstantEntityClass entity)
    {
        return new ConfigurationConstantResponseDTO
        {
            Id = entity.Id,
            ConfigurationKey = entity.ConfigurationKey,
            ConfigurationValue = entity.ConfigurationValue,
            Notes = entity.Notes,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }
}
