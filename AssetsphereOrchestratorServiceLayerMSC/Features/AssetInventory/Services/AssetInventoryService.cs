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
        string assetTag = string.IsNullOrWhiteSpace(request.AssetTag)
            ? $"AST-{DateTime.UtcNow.Year}-{Random.Shared.Next(1000, 9999)}"
            : request.AssetTag.Trim().ToUpper();

        if (!AssetTagSValidator.Current.Validate(assetTag))
        {
            throw new ValidationCException("Asset Tag is invalid or improperly formatted.");
        }

        bool tagExists = await _dbContext.Assets.AnyAsync(a => a.AssetTag.ToLower() == assetTag.ToLower());
        if (tagExists)
        {
            throw new ValidationCException(AssetInventoryCON.DuplicateAssetTag);
        }

        string? specsJson = request.HardwareSpecsJson;
        if (string.IsNullOrWhiteSpace(specsJson) && request.Specs != null)
        {
            specsJson = System.Text.Json.JsonSerializer.Serialize(request.Specs);
        }

        string procurementJson = request.ProcurementInfoJson ?? System.Text.Json.JsonSerializer.Serialize(new
        {
            purchaseCost = request.PurchasePrice,
            currency = string.IsNullOrWhiteSpace(request.Currency) ? "USD" : request.Currency.Trim().ToUpper(),
            purchaseDate = DateTime.UtcNow.ToString("yyyy-MM-dd"),
            vendorName = request.Manufacturer
        });

        AssetEntityClass newAsset = new AssetEntityClass
        {
            Id = Guid.NewGuid(),
            AssetTag = assetTag,
            SerialNumber = request.SerialNumber.Trim(),
            Category = string.IsNullOrWhiteSpace(request.Category) ? "Computing" : request.Category.Trim(),
            Subtype = string.IsNullOrWhiteSpace(request.Subtype) ? "Hardware Device" : request.Subtype.Trim(),
            ModelName = string.IsNullOrWhiteSpace(request.ModelName) ? request.SerialNumber.Trim() : request.ModelName.Trim(),
            Manufacturer = string.IsNullOrWhiteSpace(request.Manufacturer) ? "Enterprise Vendor" : request.Manufacturer.Trim(),
            Status = string.IsNullOrWhiteSpace(request.Status) ? "Inventory" : request.Status.Trim(),
            AssignedEmployeeId = request.AssignedEmployeeId,
            AssignedEmployeeName = request.AssignedEmployeeName,
            AssignedDepartment = request.AssignedDepartment,
            AssignedDate = request.AssignedDate ?? (!string.IsNullOrWhiteSpace(request.AssignedEmployeeId) || !string.IsNullOrWhiteSpace(request.AssignedEmployeeName) ? DateTime.UtcNow : null),
            Location = string.IsNullOrWhiteSpace(request.Location) ? "HQ Warehouse" : request.Location.Trim(),
            PurchasePrice = request.PurchasePrice,
            CurrentBookValue = request.CurrentBookValue > 0 ? request.CurrentBookValue : request.PurchasePrice,
            DepreciationMethod = request.DepreciationMethod,
            UsefulLifeMonths = request.UsefulLifeMonths,
            SalvageValue = request.SalvageValue,
            HardwareSpecsJson = specsJson,
            ProcurementInfoJson = procurementJson,
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
        if (request.AssignedDepartment != null) asset.AssignedDepartment = request.AssignedDepartment;
        if (request.AssignedDate.HasValue)
        {
            asset.AssignedDate = request.AssignedDate;
        }
        else if (!string.IsNullOrWhiteSpace(request.AssignedEmployeeId) && string.IsNullOrWhiteSpace(asset.AssignedEmployeeId))
        {
            asset.AssignedDate = DateTime.UtcNow;
        }
        else if (string.IsNullOrWhiteSpace(request.AssignedEmployeeId) && request.AssignedEmployeeId != null)
        {
            asset.AssignedDate = null;
        }
        if (request.Location != null) asset.Location = request.Location;
        if (request.PurchasePrice.HasValue)
        {
            asset.PurchasePrice = request.PurchasePrice.Value;
            asset.CurrentBookValue = request.PurchasePrice.Value;
        }
        if (request.CurrentBookValue.HasValue) asset.CurrentBookValue = request.CurrentBookValue.Value;
        if (request.DepreciationMethod != null) asset.DepreciationMethod = request.DepreciationMethod;
        if (request.UsefulLifeMonths.HasValue) asset.UsefulLifeMonths = request.UsefulLifeMonths.Value;
        if (request.SalvageValue.HasValue) asset.SalvageValue = request.SalvageValue.Value;
        if (request.HardwareSpecsJson != null) asset.HardwareSpecsJson = request.HardwareSpecsJson;
        if (request.ProcurementInfoJson != null)
        {
            asset.ProcurementInfoJson = request.ProcurementInfoJson;
        }
        else if (!string.IsNullOrWhiteSpace(request.Currency) || request.PurchasePrice.HasValue)
        {
            try
            {
                var docObj = !string.IsNullOrWhiteSpace(asset.ProcurementInfoJson)
                    ? System.Text.Json.Nodes.JsonNode.Parse(asset.ProcurementInfoJson) as System.Text.Json.Nodes.JsonObject
                    : new System.Text.Json.Nodes.JsonObject();

                docObj ??= new System.Text.Json.Nodes.JsonObject();

                if (!string.IsNullOrWhiteSpace(request.Currency))
                {
                    string curUpper = request.Currency.Trim().ToUpper();
                    docObj["currency"] = curUpper;
                    docObj["Currency"] = curUpper;
                }
                if (request.PurchasePrice.HasValue)
                {
                    docObj["purchaseCost"] = request.PurchasePrice.Value;
                    docObj["PurchaseCost"] = request.PurchasePrice.Value;
                }
                if (request.Manufacturer != null)
                {
                    docObj["vendorName"] = request.Manufacturer;
                }

                asset.ProcurementInfoJson = docObj.ToJsonString();
            }
            catch { }
        }
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
        if (!string.IsNullOrWhiteSpace(request.Department)) asset.AssignedDepartment = request.Department;
        if (!string.IsNullOrWhiteSpace(request.Location)) asset.Location = request.Location;
        asset.AssignedDate = request.AssignedDate ?? DateTime.UtcNow;
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

    private static decimal _cachedExchangeRate = 87.5m;
    private static DateTime _rateCacheExpiry = DateTime.MinValue;
    private static readonly HttpClient _httpClient = new HttpClient { Timeout = TimeSpan.FromSeconds(5) };

    private static async Task<decimal> GetLiveUsdToInrRateAsync()
    {
        if (DateTime.UtcNow < _rateCacheExpiry)
        {
            return _cachedExchangeRate;
        }

        try
        {
            var response = await _httpClient.GetAsync("https://open.er-api.com/v6/latest/USD");
            if (response.IsSuccessStatusCode)
            {
                using var stream = await response.Content.ReadAsStreamAsync();
                using var doc = await System.Text.Json.JsonDocument.ParseAsync(stream);
                if (doc.RootElement.TryGetProperty("rates", out var rates) &&
                    rates.TryGetProperty("INR", out var inrRate))
                {
                    decimal rate = inrRate.GetDecimal();
                    if (rate > 0)
                    {
                        _cachedExchangeRate = rate;
                        _rateCacheExpiry = DateTime.UtcNow.AddHours(1);
                        return _cachedExchangeRate;
                    }
                }
            }
        }
        catch
        {
            // Fallback to latest cached rate or 87.5
        }

        return _cachedExchangeRate;
    }

    public async Task<AssetValuationSummaryResponseDTO> GetValuationSummaryAsync(AssetValuationSummaryRequestDTO? request)
    {
        // 1. Fetch Target Currency from AS_ConfigurationConstantTBL
        string targetCurrency = "INR";
        var config = await _dbContext.ConfigurationConstants
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.ConfigurationKey == "PORTFOLIO_VALUATION_CURRENCY" && !c.IsDeleted);
        if (config != null && !string.IsNullOrWhiteSpace(config.ConfigurationValue))
        {
            targetCurrency = config.ConfigurationValue.Trim().ToUpper();
        }

        // 2. Fetch live exchange rate
        decimal usdToInrRate = await GetLiveUsdToInrRateAsync();

        // 3. Query active assets
        IQueryable<AssetEntityClass> query = _dbContext.Assets
            .AsNoTracking()
            .Where(a => !a.IsDeleted);

        if (request?.AssetIds != null && request.AssetIds.Count > 0)
        {
            query = query.Where(a => request.AssetIds.Contains(a.Id));
        }

        List<AssetEntityClass> assets = await query.ToListAsync();

        decimal totalUsd = 0;
        decimal totalInr = 0;
        int usdCount = 0;
        int inrCount = 0;

        foreach (var a in assets)
        {
            string cur = "USD";
            if (!string.IsNullOrWhiteSpace(a.ProcurementInfoJson))
            {
                try
                {
                    using var doc = System.Text.Json.JsonDocument.Parse(a.ProcurementInfoJson);
                    if (doc.RootElement.TryGetProperty("currency", out var prop) ||
                        doc.RootElement.TryGetProperty("Currency", out prop))
                    {
                        cur = prop.GetString()?.Trim().ToUpper() ?? "USD";
                    }
                }
                catch { }
            }

            decimal val = a.CurrentBookValue > 0 ? a.CurrentBookValue : a.PurchasePrice;

            if (cur == "INR" || cur == "₹" || cur == "RUPEES")
            {
                totalInr += val;
                inrCount++;
            }
            else
            {
                totalUsd += val;
                usdCount++;
            }
        }

        decimal convertedTotal;
        string targetSymbol;

        if (targetCurrency == "INR")
        {
            targetSymbol = "₹";
            convertedTotal = totalInr + (totalUsd * usdToInrRate);
        }
        else
        {
            targetSymbol = "$";
            convertedTotal = totalUsd + (usdToInrRate > 0 ? (totalInr / usdToInrRate) : 0);
        }

        return new AssetValuationSummaryResponseDTO
        {
            TargetCurrency = targetCurrency,
            TargetCurrencySymbol = targetSymbol,
            ConvertedTotalValuation = Math.Round(convertedTotal, 2),
            TotalUsdValuation = Math.Round(totalUsd, 2),
            TotalInrValuation = Math.Round(totalInr, 2),
            UsdAssetCount = usdCount,
            InrAssetCount = inrCount,
            TotalAssetCount = assets.Count,
            ExchangeRateUsdToInr = usdToInrRate,
            ExchangeRateUpdatedAt = _rateCacheExpiry == DateTime.MinValue ? DateTime.UtcNow : _rateCacheExpiry.AddHours(-1)
        };
    }

    private static AssetResponseDTO MapToDTO(AssetEntityClass asset)
    {
        HardwareSpecsDTO? specs = null;
        if (!string.IsNullOrWhiteSpace(asset.HardwareSpecsJson))
        {
            try
            {
                specs = System.Text.Json.JsonSerializer.Deserialize<HardwareSpecsDTO>(asset.HardwareSpecsJson);
            }
            catch
            {
                // Fallback to null on parsing discrepancy
            }
        }

        string currency = "USD";
        if (!string.IsNullOrWhiteSpace(asset.ProcurementInfoJson))
        {
            try
            {
                using var doc = System.Text.Json.JsonDocument.Parse(asset.ProcurementInfoJson);
                if (doc.RootElement.TryGetProperty("currency", out var prop) ||
                    doc.RootElement.TryGetProperty("Currency", out prop))
                {
                    currency = prop.GetString()?.Trim().ToUpper() ?? "USD";
                }
            }
            catch { }
        }

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
            AssignedDate = asset.AssignedDate,
            Location = asset.Location,
            PurchasePrice = asset.PurchasePrice,
            Currency = currency,
            CurrentBookValue = asset.CurrentBookValue,
            DepreciationMethod = asset.DepreciationMethod,
            UsefulLifeMonths = asset.UsefulLifeMonths,
            SalvageValue = asset.SalvageValue,
            Specs = specs,
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
