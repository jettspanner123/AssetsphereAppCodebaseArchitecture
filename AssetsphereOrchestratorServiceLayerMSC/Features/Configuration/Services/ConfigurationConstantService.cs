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

    public async Task<ConfigurationConstantResponseDTO> AddDesignationAsync(string department, string designation)
    {
        string dept = department.Trim();
        string des = designation.Trim();

        var entity = await _context.ConfigurationConstants
            .FirstOrDefaultAsync(c => c.ConfigurationKey == "EMPLOYEE_DESIGNATIONS" && !c.IsDeleted);

        Dictionary<string, List<string>> map = new(StringComparer.OrdinalIgnoreCase);

        if (entity == null)
        {
            entity = new ConfigurationConstantEntityClass
            {
                Id = Guid.NewGuid(),
                ConfigurationKey = "EMPLOYEE_DESIGNATIONS",
                ConfigurationValue = "{}",
                Notes = "Enterprise employee organizational designations mapped by department",
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "operator"
            };
            await _context.ConfigurationConstants.AddAsync(entity);
        }
        else if (!string.IsNullOrWhiteSpace(entity.ConfigurationValue))
        {
            try
            {
                var parsed = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, List<string>>>(entity.ConfigurationValue);
                if (parsed != null)
                {
                    foreach (var kvp in parsed)
                    {
                        map[kvp.Key] = kvp.Value ?? new List<string>();
                    }
                }
            }
            catch
            {
                // Fallback to empty map
            }
        }

        if (!map.ContainsKey(dept))
        {
            map[dept] = new List<string>();
        }

        if (!map[dept].Contains(des, StringComparer.OrdinalIgnoreCase))
        {
            map[dept].Add(des);
        }

        entity.ConfigurationValue = System.Text.Json.JsonSerializer.Serialize(map);
        entity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDTO(entity);
    }

    public async Task<ConfigurationConstantResponseDTO> AddDepartmentAsync(string department)
    {
        string dept = department.Trim();

        var entity = await _context.ConfigurationConstants
            .FirstOrDefaultAsync(c => c.ConfigurationKey == "EMPLOYEE_DESIGNATIONS" && !c.IsDeleted);

        Dictionary<string, List<string>> map = new(StringComparer.OrdinalIgnoreCase);

        if (entity == null)
        {
            entity = new ConfigurationConstantEntityClass
            {
                Id = Guid.NewGuid(),
                ConfigurationKey = "EMPLOYEE_DESIGNATIONS",
                ConfigurationValue = "{}",
                Notes = "Enterprise employee organizational designations mapped by department",
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "operator"
            };
            await _context.ConfigurationConstants.AddAsync(entity);
        }
        else if (!string.IsNullOrWhiteSpace(entity.ConfigurationValue))
        {
            try
            {
                var parsed = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, List<string>>>(entity.ConfigurationValue);
                if (parsed != null)
                {
                    foreach (var kvp in parsed)
                    {
                        map[kvp.Key] = kvp.Value ?? new List<string>();
                    }
                }
            }
            catch
            {
                // Fallback to empty map
            }
        }

        if (!map.ContainsKey(dept))
        {
            map[dept] = new List<string>();
        }

        entity.ConfigurationValue = System.Text.Json.JsonSerializer.Serialize(map);
        entity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDTO(entity);
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
