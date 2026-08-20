using AssetsphereOrchestratorServiceLayerMSC.Data;
using AssetsphereOrchestratorServiceLayerMSC.Exceptions;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.CloudInfrastructure.Services;

public sealed class CloudInfrastructureService
{
    private readonly AssetsphereDbContext _dbContext;

    public CloudInfrastructureService(AssetsphereDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<CloudResourceResponseDTO>> GetAllResourcesAsync(string? provider = null, string? environment = null, string? search = null)
    {
        IQueryable<CloudResourceEntityClass> query = _dbContext.CloudResources.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(provider) && provider != "all")
        {
            query = query.Where(r => r.Provider.ToLower() == provider.Trim().ToLower());
        }

        if (!string.IsNullOrWhiteSpace(environment) && environment != "all")
        {
            query = query.Where(r => r.Environment.ToLower() == environment.Trim().ToLower());
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            string s = search.Trim().ToLower();
            query = query.Where(r =>
                r.ResourceName.ToLower().Contains(s) ||
                r.ServiceType.ToLower().Contains(s) ||
                r.Region.ToLower().Contains(s) ||
                (r.OwnerEmail != null && r.OwnerEmail.ToLower().Contains(s)));
        }

        List<CloudResourceEntityClass> list = await query.OrderByDescending(r => r.MonthlyCost).ToListAsync();
        return list.Select(MapToDTO).ToList();
    }

    public async Task<CloudResourceResponseDTO> GetResourceByIdAsync(Guid id)
    {
        CloudResourceEntityClass? res = await _dbContext.CloudResources.FindAsync(id);
        if (res == null)
        {
            throw new EntityNotFoundCException("CloudResource", id);
        }

        return MapToDTO(res);
    }

    public async Task<decimal> GetTotalMonthlySpendAsync()
    {
        return await _dbContext.CloudResources
            .Where(r => r.Status == "Running")
            .SumAsync(r => r.MonthlyCost);
    }

    public async Task<CloudResourceResponseDTO> CreateResourceAsync(CloudResourceCreateDTO request, string createdBy)
    {
        CloudResourceEntityClass newRes = new CloudResourceEntityClass
        {
            Id = Guid.NewGuid(),
            ResourceName = request.ResourceName.Trim(),
            Provider = request.Provider,
            ServiceType = request.ServiceType,
            Region = request.Region,
            Status = request.Status,
            MonthlyCost = request.MonthlyCost,
            Environment = request.Environment,
            TagsJson = request.TagsJson,
            OwnerEmail = request.OwnerEmail,
            ConfigurationSpecsJson = request.ConfigurationSpecsJson,
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow
        };

        await _dbContext.CloudResources.AddAsync(newRes);
        await _dbContext.SaveChangesAsync();

        return MapToDTO(newRes);
    }

    public async Task<CloudResourceResponseDTO> UpdateResourceAsync(Guid id, CloudResourceUpdateDTO request, string updatedBy)
    {
        CloudResourceEntityClass? res = await _dbContext.CloudResources.FindAsync(id);
        if (res == null)
        {
            throw new EntityNotFoundCException("CloudResource", id);
        }

        if (request.ResourceName != null) res.ResourceName = request.ResourceName.Trim();
        if (request.Provider != null) res.Provider = request.Provider;
        if (request.ServiceType != null) res.ServiceType = request.ServiceType;
        if (request.Region != null) res.Region = request.Region;
        if (request.Status != null) res.Status = request.Status;
        if (request.MonthlyCost.HasValue) res.MonthlyCost = request.MonthlyCost.Value;
        if (request.Environment != null) res.Environment = request.Environment;
        if (request.TagsJson != null) res.TagsJson = request.TagsJson;
        if (request.OwnerEmail != null) res.OwnerEmail = request.OwnerEmail;
        if (request.ConfigurationSpecsJson != null) res.ConfigurationSpecsJson = request.ConfigurationSpecsJson;

        res.UpdatedBy = updatedBy;
        res.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();
        return MapToDTO(res);
    }

    public async Task<bool> DeleteResourceAsync(Guid id, string deletedBy)
    {
        CloudResourceEntityClass? res = await _dbContext.CloudResources.FindAsync(id);
        if (res == null)
        {
            throw new EntityNotFoundCException("CloudResource", id);
        }

        res.IsDeleted = true;
        res.DeletedAt = DateTime.UtcNow;
        res.UpdatedBy = deletedBy;

        await _dbContext.SaveChangesAsync();
        return true;
    }

    private static CloudResourceResponseDTO MapToDTO(CloudResourceEntityClass res)
    {
        return new CloudResourceResponseDTO
        {
            Id = res.Id,
            ResourceName = res.ResourceName,
            Provider = res.Provider,
            ServiceType = res.ServiceType,
            Region = res.Region,
            Status = res.Status,
            MonthlyCost = res.MonthlyCost,
            Environment = res.Environment,
            TagsJson = res.TagsJson,
            OwnerEmail = res.OwnerEmail,
            ConfigurationSpecsJson = res.ConfigurationSpecsJson,
            CreatedAt = res.CreatedAt,
            UpdatedAt = res.UpdatedAt
        };
    }
}
