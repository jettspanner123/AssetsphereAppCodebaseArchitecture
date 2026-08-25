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

    public async Task<ConfigurationConstantResponseDTO> AddWorkLocationAsync(string location)
    {
        string loc = location.Trim();

        var entity = await _context.ConfigurationConstants
            .FirstOrDefaultAsync(c => c.ConfigurationKey == "WORK_LOCATIONS" && !c.IsDeleted);

        List<string> locations = new();

        if (entity == null)
        {
            entity = new ConfigurationConstantEntityClass
            {
                Id = Guid.NewGuid(),
                ConfigurationKey = "WORK_LOCATIONS",
                ConfigurationValue = "[\"Pune, Maharastra\"]",
                Notes = "Primary enterprise physical and remote work locations directory",
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "operator"
            };
            await _context.ConfigurationConstants.AddAsync(entity);
        }
        else if (!string.IsNullOrWhiteSpace(entity.ConfigurationValue))
        {
            try
            {
                var parsed = System.Text.Json.JsonSerializer.Deserialize<List<string>>(entity.ConfigurationValue);
                if (parsed != null)
                {
                    locations = parsed;
                }
            }
            catch
            {
                // Fallback
            }
        }

        if (!locations.Contains(loc, StringComparer.OrdinalIgnoreCase))
        {
            locations.Add(loc);
        }

        entity.ConfigurationValue = System.Text.Json.JsonSerializer.Serialize(locations);
        entity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDTO(entity);
    }

    public async Task<(bool Succeeded, string? ErrorMessage, ConfigurationConstantResponseDTO? Constant)> DeleteWorkLocationAsync(string location)
    {
        string loc = location.Trim();
        string locLower = loc.ToLower();

        // 1. Dependency checks: Employees & Assets
        int employeeDependencies = await _context.Employees
            .CountAsync(e => !e.IsDeleted && e.Location != null && e.Location.ToLower() == locLower);

        int assetDependencies = await _context.Assets
            .CountAsync(a => !a.IsDeleted && a.Location != null && a.Location.ToLower() == locLower);

        if (employeeDependencies > 0 || assetDependencies > 0)
        {
            string employeeText = employeeDependencies > 0 ? $"{employeeDependencies} employee(s)" : null;
            string assetText = assetDependencies > 0 ? $"{assetDependencies} asset(s)" : null;
            string combinedText = string.Join(" and ", new[] { employeeText, assetText }.Where(t => t != null));

            return (false, $"Cannot delete '{loc}' because it is currently assigned to {combinedText}. Please reassign or update these dependencies first.", null);
        }

        var entity = await _context.ConfigurationConstants
            .FirstOrDefaultAsync(c => c.ConfigurationKey == "WORK_LOCATIONS" && !c.IsDeleted);

        if (entity == null)
        {
            return (false, "Work locations configuration not found.", null);
        }

        List<string> locations = new();
        try
        {
            var parsed = System.Text.Json.JsonSerializer.Deserialize<List<string>>(entity.ConfigurationValue);
            if (parsed != null)
            {
                locations = parsed;
            }
        }
        catch
        {
            // Ignore
        }

        locations.RemoveAll(l => string.Equals(l, loc, StringComparison.OrdinalIgnoreCase));

        entity.ConfigurationValue = System.Text.Json.JsonSerializer.Serialize(locations);
        entity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return (true, null, MapToDTO(entity));
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
