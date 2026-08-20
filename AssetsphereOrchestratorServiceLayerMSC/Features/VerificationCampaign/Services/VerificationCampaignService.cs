using AssetsphereOrchestratorServiceLayerMSC.Data;
using AssetsphereOrchestratorServiceLayerMSC.Exceptions;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.VerificationCampaign.Services;

public sealed class VerificationCampaignService
{
    private readonly AssetsphereDbContext _dbContext;

    public VerificationCampaignService(AssetsphereDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<VerificationCampaignResponseDTO>> GetAllCampaignsAsync()
    {
        List<VerificationCampaignEntityClass> list = await _dbContext.VerificationCampaigns
            .AsNoTracking()
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        return list.Select(MapToDTO).ToList();
    }

    public async Task<VerificationCampaignResponseDTO> GetCampaignByIdAsync(Guid id)
    {
        VerificationCampaignEntityClass? c = await _dbContext.VerificationCampaigns.FindAsync(id);
        if (c == null)
        {
            throw new EntityNotFoundCException("VerificationCampaign", id);
        }

        return MapToDTO(c);
    }

    public async Task<VerificationScanResultDTO> VerifyScanAsync(Guid campaignId, VerifyScanDTO scan, string updatedBy)
    {
        VerificationCampaignEntityClass? campaign = await _dbContext.VerificationCampaigns.FindAsync(campaignId);
        if (campaign == null)
        {
            throw new EntityNotFoundCException("VerificationCampaign", campaignId);
        }

        AssetEntityClass? asset = await _dbContext.Assets
            .FirstOrDefaultAsync(a => a.AssetTag.ToLower() == scan.AssetTag.Trim().ToLower());

        if (asset == null)
        {
            campaign.DiscrepancyCount += 1;
            campaign.UpdatedAt = DateTime.UtcNow;
            campaign.UpdatedBy = updatedBy;
            await _dbContext.SaveChangesAsync();

            return new VerificationScanResultDTO
            {
                Success = false,
                AssetTag = scan.AssetTag,
                Message = "Unregistered Asset Tag scanned. Flagged as discrepancy.",
                IsDiscrepancy = true,
                TotalVerified = campaign.VerifiedAssetCount,
                TotalTarget = campaign.TargetAssetCount,
                ProgressPercentage = campaign.TargetAssetCount > 0 ? Math.Round(((decimal)campaign.VerifiedAssetCount / campaign.TargetAssetCount) * 100, 1) : 0
            };
        }

        bool isLocationMismatch = !string.IsNullOrWhiteSpace(scan.ScannedLocation) &&
                                  !string.Equals(scan.ScannedLocation.Trim(), asset.Location.Trim(), StringComparison.OrdinalIgnoreCase);

        if (isLocationMismatch)
        {
            campaign.DiscrepancyCount += 1;
        }

        campaign.VerifiedAssetCount += 1;
        campaign.UpdatedAt = DateTime.UtcNow;
        campaign.UpdatedBy = updatedBy;

        // Log scan in asset timeline/notes
        asset.UpdatedAt = DateTime.UtcNow;
        asset.UpdatedBy = updatedBy;

        await _dbContext.SaveChangesAsync();

        return new VerificationScanResultDTO
        {
            Success = true,
            AssetTag = asset.AssetTag,
            Message = isLocationMismatch 
                ? $"Asset verified, but location differs (Expected: {asset.Location}, Scanned: {scan.ScannedLocation})" 
                : "Asset verified successfully.",
            IsDiscrepancy = isLocationMismatch,
            ExpectedLocation = asset.Location,
            ScannedLocation = scan.ScannedLocation,
            TotalVerified = campaign.VerifiedAssetCount,
            TotalTarget = campaign.TargetAssetCount,
            ProgressPercentage = campaign.TargetAssetCount > 0 ? Math.Round(((decimal)campaign.VerifiedAssetCount / campaign.TargetAssetCount) * 100, 1) : 0
        };
    }

    public async Task<VerificationCampaignResponseDTO> CreateCampaignAsync(VerificationCampaignCreateDTO request, string createdBy)
    {
        int assetCount = request.TargetAssetCount > 0 ? request.TargetAssetCount : await _dbContext.Assets.CountAsync();

        VerificationCampaignEntityClass newCamp = new VerificationCampaignEntityClass
        {
            Id = Guid.NewGuid(),
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Location = request.Location.Trim(),
            Department = request.Department.Trim(),
            Status = "Active",
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            TargetAssetCount = assetCount,
            VerifiedAssetCount = 0,
            DiscrepancyCount = 0,
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow
        };

        await _dbContext.VerificationCampaigns.AddAsync(newCamp);
        await _dbContext.SaveChangesAsync();

        return MapToDTO(newCamp);
    }

    private static VerificationCampaignResponseDTO MapToDTO(VerificationCampaignEntityClass c)
    {
        return new VerificationCampaignResponseDTO
        {
            Id = c.Id,
            Title = c.Title,
            Description = c.Description,
            Location = c.Location,
            Department = c.Department,
            Status = c.Status,
            StartDate = c.StartDate,
            EndDate = c.EndDate,
            TargetAssetCount = c.TargetAssetCount,
            VerifiedAssetCount = c.VerifiedAssetCount,
            DiscrepancyCount = c.DiscrepancyCount,
            ScannedTagsJson = c.ScannedTagsJson,
            DiscrepanciesJson = c.DiscrepanciesJson,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt
        };
    }
}
