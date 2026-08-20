using AssetsphereOrchestratorServiceLayerMSC.Data;
using AssetsphereOrchestratorServiceLayerMSC.Exceptions;
using AssetsphereOrchestratorServiceLayerMSC.Features.AssetInventory.Constants;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using AssetsphereOrchestratorServiceLayerMSC.Validators;
using Microsoft.EntityFrameworkCore;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.AssetInventory.Services;

public sealed class AssetInventoryService
{
    private readonly AssetsphereDbContext _dbContext;

    public AssetInventoryService(AssetsphereDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<AssetResponseDTO>> GetAllAssetsAsync(
        string? category = null,
        string? status = null,
        string? search = null,
        string? location = null)
    {
        IQueryable<AssetEntityClass> query = _dbContext.Assets.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(category) && category != "all")
        {
            query = query.Where(a => a.Category.ToLower() == category.Trim().ToLower());
        }

        if (!string.IsNullOrWhiteSpace(status) && status != "all")
        {
            query = query.Where(a => a.Status.ToLower() == status.Trim().ToLower());
        }

        if (!string.IsNullOrWhiteSpace(location))
        {
            query = query.Where(a => a.Location.ToLower().Contains(location.Trim().ToLower()));
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            string s = search.Trim().ToLower();
            query = query.Where(a =>
                a.AssetTag.ToLower().Contains(s) ||
                a.SerialNumber.ToLower().Contains(s) ||
                a.ModelName.ToLower().Contains(s) ||
                a.Manufacturer.ToLower().Contains(s) ||
                (a.AssignedEmployeeName != null && a.AssignedEmployeeName.ToLower().Contains(s)));
        }

        List<AssetEntityClass> assets = await query.OrderByDescending(a => a.CreatedAt).ToListAsync();
        return assets.Select(MapToDTO).ToList();
    }

    public async Task<AssetResponseDTO> GetAssetByIdAsync(Guid id)
    {
        AssetEntityClass? asset = await _dbContext.Assets.FindAsync(id);
        if (asset == null)
        {
            throw new EntityNotFoundCException("Asset", id);
        }

        return MapToDTO(asset);
    }

    public async Task<AssetResponseDTO> GetAssetByTagOrQrAsync(string tagOrQr)
    {
        string term = tagOrQr.Trim().ToLower();
        AssetEntityClass? asset = await _dbContext.Assets
            .FirstOrDefaultAsync(a => a.AssetTag.ToLower() == term || a.SerialNumber.ToLower() == term);

        if (asset == null)
        {
            throw new EntityNotFoundCException("Asset", tagOrQr);
        }

        return MapToDTO(asset);
    }

    public async Task<AssetResponseDTO> CreateAssetAsync(AssetCreateDTO request, string createdBy)
    {
        if (!AssetTagSValidator.Current.Validate(request.AssetTag))
        {
            throw new ValidationCException("Asset Tag is invalid or improperly formatted.");
        }

        bool tagExists = await _dbContext.Assets.AnyAsync(a => a.AssetTag.ToLower() == request.AssetTag.Trim().ToLower());
        if (tagExists)
        {
            throw new ValidationCException(AssetInventoryCON.DuplicateAssetTag);
        }

        AssetEntityClass newAsset = new AssetEntityClass
        {
            Id = Guid.NewGuid(),
            AssetTag = request.AssetTag.Trim().ToUpper(),
            SerialNumber = request.SerialNumber.Trim(),
            Category = request.Category,
            Subtype = request.Subtype,
            ModelName = request.ModelName.Trim(),
            Manufacturer = request.Manufacturer.Trim(),
            Status = request.Status,
            AssignedEmployeeId = request.AssignedEmployeeId,
            AssignedEmployeeName = request.AssignedEmployeeName,
            AssignedDepartment = request.AssignedDepartment,
            Location = request.Location,
            PurchasePrice = request.PurchasePrice,
            CurrentBookValue = request.CurrentBookValue,
            DepreciationMethod = request.DepreciationMethod,
            UsefulLifeMonths = request.UsefulLifeMonths,
            SalvageValue = request.SalvageValue,
            HardwareSpecsJson = request.HardwareSpecsJson,
            ProcurementInfoJson = request.ProcurementInfoJson,
            WarrantyInfoJson = request.WarrantyInfoJson,
            SecurityAndComplianceJson = request.SecurityAndComplianceJson,
            NetworkConfigJson = request.NetworkConfigJson,
            HealthMetricJson = request.HealthMetricJson,
            TimelineEventsJson = request.TimelineEventsJson,
            MaintenanceHistoryJson = request.MaintenanceHistoryJson,
            InstalledSoftwareJson = request.InstalledSoftwareJson,
            Notes = request.Notes,
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow
        };

        await _dbContext.Assets.AddAsync(newAsset);
        await _dbContext.SaveChangesAsync();

        return MapToDTO(newAsset);
    }

    public async Task<AssetResponseDTO> UpdateAssetAsync(Guid id, AssetUpdateDTO request, string updatedBy)
    {
        AssetEntityClass? asset = await _dbContext.Assets.FindAsync(id);
        if (asset == null)
        {
            throw new EntityNotFoundCException("Asset", id);
        }

        if (!string.IsNullOrWhiteSpace(request.AssetTag) && request.AssetTag != asset.AssetTag)
        {
            bool tagExists = await _dbContext.Assets.AnyAsync(a => a.Id != id && a.AssetTag.ToLower() == request.AssetTag.Trim().ToLower());
            if (tagExists)
            {
                throw new ValidationCException(AssetInventoryCON.DuplicateAssetTag);
            }
            asset.AssetTag = request.AssetTag.Trim().ToUpper();
        }

        if (request.SerialNumber != null) asset.SerialNumber = request.SerialNumber.Trim();
        if (request.Category != null) asset.Category = request.Category;
        if (request.Subtype != null) asset.Subtype = request.Subtype;
        if (request.ModelName != null) asset.ModelName = request.ModelName.Trim();
        if (request.Manufacturer != null) asset.Manufacturer = request.Manufacturer.Trim();
        if (request.Status != null) asset.Status = request.Status;
        if (request.AssignedEmployeeId != null) asset.AssignedEmployeeId = request.AssignedEmployeeId;
        if (request.AssignedEmployeeName != null) asset.AssignedEmployeeName = request.AssignedEmployeeName;
        if (request.AssignedDepartment.HasValue) asset.AssignedDepartment = request.AssignedDepartment.Value;
        if (request.Location != null) asset.Location = request.Location;
        if (request.PurchasePrice.HasValue) asset.PurchasePrice = request.PurchasePrice.Value;
        if (request.CurrentBookValue.HasValue) asset.CurrentBookValue = request.CurrentBookValue.Value;
        if (request.DepreciationMethod != null) asset.DepreciationMethod = request.DepreciationMethod;
        if (request.UsefulLifeMonths.HasValue) asset.UsefulLifeMonths = request.UsefulLifeMonths.Value;
        if (request.SalvageValue.HasValue) asset.SalvageValue = request.SalvageValue.Value;
        if (request.HardwareSpecsJson != null) asset.HardwareSpecsJson = request.HardwareSpecsJson;
        if (request.ProcurementInfoJson != null) asset.ProcurementInfoJson = request.ProcurementInfoJson;
        if (request.WarrantyInfoJson != null) asset.WarrantyInfoJson = request.WarrantyInfoJson;
        if (request.SecurityAndComplianceJson != null) asset.SecurityAndComplianceJson = request.SecurityAndComplianceJson;
        if (request.NetworkConfigJson != null) asset.NetworkConfigJson = request.NetworkConfigJson;
        if (request.HealthMetricJson != null) asset.HealthMetricJson = request.HealthMetricJson;
        if (request.TimelineEventsJson != null) asset.TimelineEventsJson = request.TimelineEventsJson;
        if (request.MaintenanceHistoryJson != null) asset.MaintenanceHistoryJson = request.MaintenanceHistoryJson;
        if (request.InstalledSoftwareJson != null) asset.InstalledSoftwareJson = request.InstalledSoftwareJson;
        if (request.Notes != null) asset.Notes = request.Notes;

        asset.UpdatedBy = updatedBy;
        asset.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();
        return MapToDTO(asset);
    }

    public async Task<bool> DeleteAssetAsync(Guid id, string deletedBy)
    {
        AssetEntityClass? asset = await _dbContext.Assets.FindAsync(id);
        if (asset == null)
        {
            throw new EntityNotFoundCException("Asset", id);
        }

        asset.IsDeleted = true;
        asset.DeletedAt = DateTime.UtcNow;
        asset.UpdatedBy = deletedBy;

        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<AssetResponseDTO> UpdateLifecycleStatusAsync(Guid id, AssetLifecycleUpdateDTO request, string updatedBy)
    {
        AssetEntityClass? asset = await _dbContext.Assets.FindAsync(id);
        if (asset == null)
        {
            throw new EntityNotFoundCException("Asset", id);
        }

        asset.Status = request.NewStatus;
        asset.UpdatedBy = updatedBy;
        asset.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();
        return MapToDTO(asset);
    }

    public async Task<AssetResponseDTO> AssignAssetAsync(Guid id, AssetAssignDTO request, string updatedBy)
    {
        AssetEntityClass? asset = await _dbContext.Assets.FindAsync(id);
        if (asset == null)
        {
            throw new EntityNotFoundCException("Asset", id);
        }

        asset.AssignedEmployeeId = request.EmployeeId;
        asset.AssignedEmployeeName = request.EmployeeName;
        if (request.Department.HasValue) asset.AssignedDepartment = request.Department.Value;
        if (!string.IsNullOrWhiteSpace(request.Location)) asset.Location = request.Location;
        asset.Status = "Assigned";
        asset.UpdatedBy = updatedBy;
        asset.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();
        return MapToDTO(asset);
    }

    public async Task<int> BulkActionAsync(AssetBulkActionDTO request, string updatedBy)
    {
        List<AssetEntityClass> assets = await _dbContext.Assets
            .Where(a => request.AssetIds.Contains(a.Id))
            .ToListAsync();

        foreach (AssetEntityClass a in assets)
        {
            if (request.Action == "UPDATE_STATUS" && !string.IsNullOrWhiteSpace(request.Value))
            {
                a.Status = request.Value;
            }
            else if (request.Action == "ASSIGN_LOCATION" && !string.IsNullOrWhiteSpace(request.Value))
            {
                a.Location = request.Value;
            }
            else if (request.Action == "DELETE")
            {
                a.IsDeleted = true;
                a.DeletedAt = DateTime.UtcNow;
            }
            a.UpdatedBy = updatedBy;
            a.UpdatedAt = DateTime.UtcNow;
        }

        await _dbContext.SaveChangesAsync();
        return assets.Count;
    }

    private static AssetResponseDTO MapToDTO(AssetEntityClass asset)
    {
        return new AssetResponseDTO
        {
            Id = asset.Id,
            AssetTag = asset.AssetTag,
            SerialNumber = asset.SerialNumber,
            Category = asset.Category,
            Subtype = asset.Subtype,
            ModelName = asset.ModelName,
            Manufacturer = asset.Manufacturer,
            Status = asset.Status,
            AssignedEmployeeId = asset.AssignedEmployeeId,
            AssignedEmployeeName = asset.AssignedEmployeeName,
            AssignedDepartment = asset.AssignedDepartment,
            Location = asset.Location,
            PurchasePrice = asset.PurchasePrice,
            CurrentBookValue = asset.CurrentBookValue,
            DepreciationMethod = asset.DepreciationMethod,
            UsefulLifeMonths = asset.UsefulLifeMonths,
            SalvageValue = asset.SalvageValue,
            HardwareSpecsJson = asset.HardwareSpecsJson,
            ProcurementInfoJson = asset.ProcurementInfoJson,
            WarrantyInfoJson = asset.WarrantyInfoJson,
            SecurityAndComplianceJson = asset.SecurityAndComplianceJson,
            NetworkConfigJson = asset.NetworkConfigJson,
            HealthMetricJson = asset.HealthMetricJson,
            TimelineEventsJson = asset.TimelineEventsJson,
            MaintenanceHistoryJson = asset.MaintenanceHistoryJson,
            InstalledSoftwareJson = asset.InstalledSoftwareJson,
            Notes = asset.Notes,
            CreatedAt = asset.CreatedAt,
            UpdatedAt = asset.UpdatedAt
        };
    }
}
