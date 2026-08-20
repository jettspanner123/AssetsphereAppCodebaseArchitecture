using AssetsphereOrchestratorServiceLayerMSC.Data;
using AssetsphereOrchestratorServiceLayerMSC.Exceptions;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.Vendors.Services;

public sealed class VendorsService
{
    private readonly AssetsphereDbContext _dbContext;

    public VendorsService(AssetsphereDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<VendorResponseDTO>> GetAllVendorsAsync(string? category = null, string? search = null)
    {
        IQueryable<VendorProfileEntityClass> query = _dbContext.VendorProfiles.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(category) && category != "all")
        {
            query = query.Where(v => v.Category.ToLower() == category.Trim().ToLower());
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            string s = search.Trim().ToLower();
            query = query.Where(v =>
                v.VendorName.ToLower().Contains(s) ||
                v.ContactPerson.ToLower().Contains(s) ||
                v.Email.ToLower().Contains(s));
        }

        List<VendorProfileEntityClass> list = await query.OrderByDescending(v => v.Rating).ToListAsync();
        return list.Select(MapToDTO).ToList();
    }

    public async Task<VendorResponseDTO> GetVendorByIdAsync(Guid id)
    {
        VendorProfileEntityClass? vendor = await _dbContext.VendorProfiles.FindAsync(id);
        if (vendor == null)
        {
            throw new EntityNotFoundCException("Vendor", id);
        }

        return MapToDTO(vendor);
    }

    public async Task<VendorResponseDTO> CreateVendorAsync(VendorCreateDTO request, string createdBy)
    {
        VendorProfileEntityClass newVendor = new VendorProfileEntityClass
        {
            Id = Guid.NewGuid(),
            VendorName = request.VendorName.Trim(),
            Category = request.Category.Trim(),
            ContactPerson = request.ContactPerson.Trim(),
            Email = request.Email.Trim().ToLower(),
            Phone = request.Phone.Trim(),
            Address = request.Address.Trim(),
            GstNumber = request.GstNumber.Trim(),
            Status = request.Status,
            Rating = request.Rating,
            SlaDetails = request.SlaDetails,
            ResponseTimeHours = request.ResponseTimeHours,
            ContractTerms = request.ContractTerms,
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow
        };

        await _dbContext.VendorProfiles.AddAsync(newVendor);
        await _dbContext.SaveChangesAsync();

        return MapToDTO(newVendor);
    }

    public async Task<VendorResponseDTO> UpdateVendorAsync(Guid id, VendorUpdateDTO request, string updatedBy)
    {
        VendorProfileEntityClass? vendor = await _dbContext.VendorProfiles.FindAsync(id);
        if (vendor == null)
        {
            throw new EntityNotFoundCException("Vendor", id);
        }

        if (request.VendorName != null) vendor.VendorName = request.VendorName.Trim();
        if (request.Category != null) vendor.Category = request.Category.Trim();
        if (request.ContactPerson != null) vendor.ContactPerson = request.ContactPerson.Trim();
        if (request.Email != null) vendor.Email = request.Email.Trim().ToLower();
        if (request.Phone != null) vendor.Phone = request.Phone.Trim();
        if (request.Address != null) vendor.Address = request.Address.Trim();
        if (request.GstNumber != null) vendor.GstNumber = request.GstNumber.Trim();
        if (request.Status != null) vendor.Status = request.Status;
        if (request.Rating.HasValue) vendor.Rating = request.Rating.Value;
        if (request.SlaDetails != null) vendor.SlaDetails = request.SlaDetails;
        if (request.ResponseTimeHours.HasValue) vendor.ResponseTimeHours = request.ResponseTimeHours.Value;
        if (request.ContractTerms != null) vendor.ContractTerms = request.ContractTerms;

        vendor.UpdatedBy = updatedBy;
        vendor.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();
        return MapToDTO(vendor);
    }

    public async Task<bool> DeleteVendorAsync(Guid id, string deletedBy)
    {
        VendorProfileEntityClass? vendor = await _dbContext.VendorProfiles.FindAsync(id);
        if (vendor == null)
        {
            throw new EntityNotFoundCException("Vendor", id);
        }

        vendor.IsDeleted = true;
        vendor.DeletedAt = DateTime.UtcNow;
        vendor.UpdatedBy = deletedBy;

        await _dbContext.SaveChangesAsync();
        return true;
    }

    private static VendorResponseDTO MapToDTO(VendorProfileEntityClass vendor)
    {
        return new VendorResponseDTO
        {
            Id = vendor.Id,
            VendorName = vendor.VendorName,
            Category = vendor.Category,
            ContactPerson = vendor.ContactPerson,
            Email = vendor.Email,
            Phone = vendor.Phone,
            Address = vendor.Address,
            GstNumber = vendor.GstNumber,
            Status = vendor.Status,
            Rating = vendor.Rating,
            SlaDetails = vendor.SlaDetails,
            ResponseTimeHours = vendor.ResponseTimeHours,
            ContractTerms = vendor.ContractTerms,
            CreatedAt = vendor.CreatedAt,
            UpdatedAt = vendor.UpdatedAt
        };
    }
}
