using AssetsphereOrchestratorServiceLayerMSC.Data;
using AssetsphereOrchestratorServiceLayerMSC.Exceptions;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.SoftwareLicenses.Services;

public sealed class SoftwareLicensesService
{
    private readonly AssetsphereDbContext _dbContext;

    public SoftwareLicensesService(AssetsphereDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<SoftwareLicenseResponseDTO>> GetAllLicensesAsync(string? category = null, string? complianceStatus = null, string? search = null)
    {
        IQueryable<SoftwareLicenseEntityClass> query = _dbContext.SoftwareLicenses.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(category) && category != "all")
        {
            query = query.Where(l => l.Category != null && l.Category.ToLower() == category.Trim().ToLower());
        }

        if (!string.IsNullOrWhiteSpace(complianceStatus) && complianceStatus != "all")
        {
            query = query.Where(l => l.ComplianceStatus.ToLower() == complianceStatus.Trim().ToLower());
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            string s = search.Trim().ToLower();
            query = query.Where(l =>
                l.SoftwareName.ToLower().Contains(s) ||
                l.Publisher.ToLower().Contains(s) ||
                l.LicenseKey.ToLower().Contains(s));
        }

        List<SoftwareLicenseEntityClass> list = await query.OrderBy(l => l.SoftwareName).ToListAsync();
        return list.Select(MapToDTO).ToList();
    }

    public async Task<SoftwareLicenseResponseDTO> GetLicenseByIdAsync(Guid id)
    {
        SoftwareLicenseEntityClass? lic = await _dbContext.SoftwareLicenses.FindAsync(id);
        if (lic == null)
        {
            throw new EntityNotFoundCException("SoftwareLicense", id);
        }

        return MapToDTO(lic);
    }

    public async Task<SoftwareLicenseResponseDTO> CreateLicenseAsync(SoftwareLicenseCreateDTO request, string createdBy)
    {
        decimal costPerSeat = request.CostPerSeat;
        decimal annualCost = request.AnnualCost;

        if (annualCost <= 0 && costPerSeat > 0 && request.TotalSeats > 0)
        {
            annualCost = costPerSeat * request.TotalSeats;
        }
        else if (costPerSeat <= 0 && annualCost > 0 && request.TotalSeats > 0)
        {
            costPerSeat = Math.Round(annualCost / request.TotalSeats, 2);
        }

        string complianceStatus = request.ComplianceStatus;
        if (string.IsNullOrWhiteSpace(complianceStatus))
        {
            if (request.ExpiryDate <= DateTime.UtcNow.AddDays(30))
            {
                complianceStatus = "Expiring Soon";
            }
            else if (request.AssignedSeats > request.TotalSeats)
            {
                complianceStatus = "Over Allocated";
            }
            else
            {
                complianceStatus = "Compliant";
            }
        }

        SoftwareLicenseEntityClass newLic = new SoftwareLicenseEntityClass
        {
            Id = Guid.NewGuid(),
            SoftwareName = request.SoftwareName.Trim(),
            Publisher = request.Publisher.Trim(),
            Version = request.Version.Trim(),
            LicenseType = request.LicenseType,
            LicenseKey = request.LicenseKey.Trim(),
            TotalSeats = request.TotalSeats,
            AssignedSeats = request.AssignedSeats,
            CostPerSeat = costPerSeat,
            AnnualCost = annualCost,
            Currency = string.IsNullOrWhiteSpace(request.Currency) ? "USD" : request.Currency.Trim().ToUpper(),
            PurchaseDate = request.PurchaseDate != default ? request.PurchaseDate : DateTime.UtcNow,
            ExpiryDate = request.ExpiryDate,
            ComplianceStatus = complianceStatus,
            AssignedUsersJson = request.AssignedUsersJson,
            AssignedDepartmentsJson = request.AssignedDepartmentsJson,
            Category = request.Category,
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow
        };

        await _dbContext.SoftwareLicenses.AddAsync(newLic);
        await _dbContext.SaveChangesAsync();

        return MapToDTO(newLic);
    }

    public async Task<SoftwareLicenseResponseDTO> UpdateLicenseAsync(Guid id, SoftwareLicenseUpdateDTO request, string updatedBy)
    {
        SoftwareLicenseEntityClass? lic = await _dbContext.SoftwareLicenses.FindAsync(id);
        if (lic == null)
        {
            throw new EntityNotFoundCException("SoftwareLicense", id);
        }

        if (request.SoftwareName != null) lic.SoftwareName = request.SoftwareName.Trim();
        if (request.Publisher != null) lic.Publisher = request.Publisher.Trim();
        if (request.Version != null) lic.Version = request.Version.Trim();
        if (request.LicenseType != null) lic.LicenseType = request.LicenseType;
        if (request.LicenseKey != null) lic.LicenseKey = request.LicenseKey.Trim();
        if (request.TotalSeats.HasValue) lic.TotalSeats = request.TotalSeats.Value;
        if (request.AssignedSeats.HasValue) lic.AssignedSeats = request.AssignedSeats.Value;
        if (request.CostPerSeat.HasValue) lic.CostPerSeat = request.CostPerSeat.Value;
        if (request.AnnualCost.HasValue) lic.AnnualCost = request.AnnualCost.Value;
        if (request.Currency != null) lic.Currency = request.Currency.Trim().ToUpper();
        if (request.PurchaseDate.HasValue) lic.PurchaseDate = request.PurchaseDate.Value;
        if (request.ExpiryDate.HasValue) lic.ExpiryDate = request.ExpiryDate.Value;
        if (request.ComplianceStatus != null) lic.ComplianceStatus = request.ComplianceStatus;
        if (request.AssignedUsersJson != null) lic.AssignedUsersJson = request.AssignedUsersJson;
        if (request.AssignedDepartmentsJson != null) lic.AssignedDepartmentsJson = request.AssignedDepartmentsJson;
        if (request.Category != null) lic.Category = request.Category;

        lic.UpdatedBy = updatedBy;
        lic.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();
        return MapToDTO(lic);
    }

    public async Task<bool> DeleteLicenseAsync(Guid id, string deletedBy)
    {
        SoftwareLicenseEntityClass? lic = await _dbContext.SoftwareLicenses.FindAsync(id);
        if (lic == null)
        {
            throw new EntityNotFoundCException("SoftwareLicense", id);
        }

        lic.IsDeleted = true;
        lic.DeletedAt = DateTime.UtcNow;
        lic.UpdatedBy = deletedBy;

        await _dbContext.SaveChangesAsync();
        return true;
    }

    private static SoftwareLicenseResponseDTO MapToDTO(SoftwareLicenseEntityClass lic)
    {
        return new SoftwareLicenseResponseDTO
        {
            Id = lic.Id,
            SoftwareName = lic.SoftwareName,
            Publisher = lic.Publisher,
            Version = lic.Version,
            LicenseType = lic.LicenseType,
            LicenseKey = lic.LicenseKey,
            TotalSeats = lic.TotalSeats,
            AssignedSeats = lic.AssignedSeats,
            CostPerSeat = lic.CostPerSeat,
            AnnualCost = lic.AnnualCost,
            Currency = lic.Currency,
            PurchaseDate = lic.PurchaseDate,
            ExpiryDate = lic.ExpiryDate,
            ComplianceStatus = lic.ComplianceStatus,
            AssignedUsersJson = lic.AssignedUsersJson,
            AssignedDepartmentsJson = lic.AssignedDepartmentsJson,
            Category = lic.Category,
            CreatedAt = lic.CreatedAt,
            UpdatedAt = lic.UpdatedAt
        };
    }
}
