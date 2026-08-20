using AssetsphereOrchestratorServiceLayerMSC.Data;
using AssetsphereOrchestratorServiceLayerMSC.Exceptions;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.Procurement.Services;

public sealed class ProcurementService
{
    private readonly AssetsphereDbContext _dbContext;

    public ProcurementService(AssetsphereDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<PurchaseOrderResponseDTO>> GetAllPurchaseOrdersAsync(string? status = null, string? search = null)
    {
        IQueryable<PurchaseOrderEntityClass> query = _dbContext.PurchaseOrders.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(status) && status != "all")
        {
            query = query.Where(p => p.Status.ToLower() == status.Trim().ToLower());
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            string s = search.Trim().ToLower();
            query = query.Where(p =>
                p.PoNumber.ToLower().Contains(s) ||
                p.VendorName.ToLower().Contains(s) ||
                p.BudgetCode.ToLower().Contains(s) ||
                p.RequestedBy.ToLower().Contains(s));
        }

        List<PurchaseOrderEntityClass> list = await query.OrderByDescending(p => p.OrderDate).ToListAsync();
        return list.Select(MapToDTO).ToList();
    }

    public async Task<PurchaseOrderResponseDTO> GetPurchaseOrderByIdAsync(Guid id)
    {
        PurchaseOrderEntityClass? po = await _dbContext.PurchaseOrders.FindAsync(id);
        if (po == null)
        {
            throw new EntityNotFoundCException("PurchaseOrder", id);
        }

        return MapToDTO(po);
    }

    public async Task<PurchaseOrderResponseDTO> CreatePurchaseOrderAsync(PurchaseOrderCreateDTO request, string createdBy)
    {
        bool exists = await _dbContext.PurchaseOrders.AnyAsync(p => p.PoNumber.ToLower() == request.PoNumber.Trim().ToLower());
        if (exists)
        {
            throw new ValidationCException("A Purchase Order with this PO Number already exists.");
        }

        PurchaseOrderEntityClass newPo = new PurchaseOrderEntityClass
        {
            Id = Guid.NewGuid(),
            PoNumber = request.PoNumber.Trim().ToUpper(),
            VendorName = request.VendorName.Trim(),
            VendorId = request.VendorId.Trim(),
            OrderDate = request.OrderDate,
            ExpectedDeliveryDate = request.ExpectedDeliveryDate,
            TotalAmount = request.TotalAmount,
            Currency = request.Currency,
            Status = request.Status,
            BudgetCode = request.BudgetCode.Trim(),
            CostCenter = request.CostCenter.Trim(),
            RequestedBy = string.IsNullOrWhiteSpace(request.RequestedBy) ? createdBy : request.RequestedBy,
            LineItemsJson = request.LineItemsJson,
            Notes = request.Notes,
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow
        };

        await _dbContext.PurchaseOrders.AddAsync(newPo);
        await _dbContext.SaveChangesAsync();

        return MapToDTO(newPo);
    }

    public async Task<PurchaseOrderResponseDTO> UpdatePurchaseOrderAsync(Guid id, PurchaseOrderUpdateDTO request, string updatedBy)
    {
        PurchaseOrderEntityClass? po = await _dbContext.PurchaseOrders.FindAsync(id);
        if (po == null)
        {
            throw new EntityNotFoundCException("PurchaseOrder", id);
        }

        if (request.VendorName != null) po.VendorName = request.VendorName.Trim();
        if (request.VendorId != null) po.VendorId = request.VendorId.Trim();
        if (request.ExpectedDeliveryDate.HasValue) po.ExpectedDeliveryDate = request.ExpectedDeliveryDate.Value;
        if (request.TotalAmount.HasValue) po.TotalAmount = request.TotalAmount.Value;
        if (request.Currency != null) po.Currency = request.Currency;
        if (request.Status != null) po.Status = request.Status;
        if (request.BudgetCode != null) po.BudgetCode = request.BudgetCode.Trim();
        if (request.CostCenter != null) po.CostCenter = request.CostCenter.Trim();
        if (request.LineItemsJson != null) po.LineItemsJson = request.LineItemsJson;
        if (request.Notes != null) po.Notes = request.Notes;

        po.UpdatedBy = updatedBy;
        po.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();
        return MapToDTO(po);
    }

    public async Task<PurchaseOrderResponseDTO> ApprovePurchaseOrderAsync(Guid id, string approvedBy)
    {
        PurchaseOrderEntityClass? po = await _dbContext.PurchaseOrders.FindAsync(id);
        if (po == null)
        {
            throw new EntityNotFoundCException("PurchaseOrder", id);
        }

        po.Status = "Approved";
        po.ApprovedBy = approvedBy;
        po.ApprovedAt = DateTime.UtcNow;
        po.UpdatedBy = approvedBy;
        po.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();
        return MapToDTO(po);
    }

    public async Task<bool> DeletePurchaseOrderAsync(Guid id, string deletedBy)
    {
        PurchaseOrderEntityClass? po = await _dbContext.PurchaseOrders.FindAsync(id);
        if (po == null)
        {
            throw new EntityNotFoundCException("PurchaseOrder", id);
        }

        po.IsDeleted = true;
        po.DeletedAt = DateTime.UtcNow;
        po.UpdatedBy = deletedBy;

        await _dbContext.SaveChangesAsync();
        return true;
    }

    private static PurchaseOrderResponseDTO MapToDTO(PurchaseOrderEntityClass po)
    {
        return new PurchaseOrderResponseDTO
        {
            Id = po.Id,
            PoNumber = po.PoNumber,
            VendorName = po.VendorName,
            VendorId = po.VendorId,
            OrderDate = po.OrderDate,
            ExpectedDeliveryDate = po.ExpectedDeliveryDate,
            TotalAmount = po.TotalAmount,
            Currency = po.Currency,
            Status = po.Status,
            BudgetCode = po.BudgetCode,
            CostCenter = po.CostCenter,
            RequestedBy = po.RequestedBy,
            ApprovedBy = po.ApprovedBy,
            ApprovedAt = po.ApprovedAt,
            LineItemsJson = po.LineItemsJson,
            Notes = po.Notes,
            CreatedAt = po.CreatedAt,
            UpdatedAt = po.UpdatedAt
        };
    }
}
