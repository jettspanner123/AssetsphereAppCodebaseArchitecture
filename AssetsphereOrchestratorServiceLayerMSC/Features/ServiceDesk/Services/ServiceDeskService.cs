using AssetsphereOrchestratorServiceLayerMSC.Data;
using AssetsphereOrchestratorServiceLayerMSC.Exceptions;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.ServiceDesk.Services;

public sealed class ServiceDeskService
{
    private readonly AssetsphereDbContext _dbContext;

    public ServiceDeskService(AssetsphereDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<ServiceTicketResponseDTO>> GetAllTicketsAsync(string? status = null, string? priority = null, string? search = null)
    {
        IQueryable<ServiceTicketEntityClass> query = _dbContext.ServiceTickets.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(status) && status != "all")
        {
            query = query.Where(t => t.Status.ToLower() == status.Trim().ToLower());
        }

        if (!string.IsNullOrWhiteSpace(priority) && priority != "all")
        {
            query = query.Where(t => t.Priority.ToLower() == priority.Trim().ToLower());
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            string s = search.Trim().ToLower();
            query = query.Where(t =>
                t.TicketNumber.ToLower().Contains(s) ||
                t.Title.ToLower().Contains(s) ||
                (t.AssetTag != null && t.AssetTag.ToLower().Contains(s)) ||
                t.RequestedByEmployeeName.ToLower().Contains(s));
        }

        List<ServiceTicketEntityClass> list = await query.OrderByDescending(t => t.CreatedAt).ToListAsync();
        return list.Select(MapToDTO).ToList();
    }

    public async Task<ServiceTicketResponseDTO> GetTicketByIdAsync(Guid id)
    {
        ServiceTicketEntityClass? ticket = await _dbContext.ServiceTickets.FindAsync(id);
        if (ticket == null)
        {
            throw new EntityNotFoundCException("ServiceTicket", id);
        }

        return MapToDTO(ticket);
    }

    public async Task<ServiceTicketResponseDTO> CreateTicketAsync(ServiceTicketCreateDTO request, string createdBy)
    {
        int ticketCount = await _dbContext.ServiceTickets.CountAsync() + 1045;
        string ticketNumber = $"TKT-2026-{ticketCount}";

        ServiceTicketEntityClass newTicket = new ServiceTicketEntityClass
        {
            Id = Guid.NewGuid(),
            TicketNumber = ticketNumber,
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Priority = request.Priority,
            Status = "Open",
            IssueCategory = request.IssueCategory,
            AssetId = request.AssetId,
            AssetTag = request.AssetTag,
            RequestedByEmployeeId = request.RequestedByEmployeeId,
            RequestedByEmployeeName = request.RequestedByEmployeeName,
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow
        };

        // If asset linked, update its status to 'Repair' if needed
        if (!string.IsNullOrWhiteSpace(request.AssetTag))
        {
            AssetEntityClass? asset = await _dbContext.Assets
                .FirstOrDefaultAsync(a => a.AssetTag.ToLower() == request.AssetTag.Trim().ToLower());
            if (asset != null && asset.Status == "In Use")
            {
                asset.Status = "Repair";
                asset.UpdatedAt = DateTime.UtcNow;
            }
        }

        await _dbContext.ServiceTickets.AddAsync(newTicket);
        await _dbContext.SaveChangesAsync();

        return MapToDTO(newTicket);
    }

    public async Task<ServiceTicketResponseDTO> UpdateTicketAsync(Guid id, ServiceTicketUpdateDTO request, string updatedBy)
    {
        ServiceTicketEntityClass? ticket = await _dbContext.ServiceTickets.FindAsync(id);
        if (ticket == null)
        {
            throw new EntityNotFoundCException("ServiceTicket", id);
        }

        if (request.Title != null) ticket.Title = request.Title.Trim();
        if (request.Description != null) ticket.Description = request.Description.Trim();
        if (request.Priority != null) ticket.Priority = request.Priority;
        if (request.Status != null) ticket.Status = request.Status;
        if (request.IssueCategory != null) ticket.IssueCategory = request.IssueCategory;
        if (request.AssignedTechnicianId != null) ticket.AssignedTechnicianId = request.AssignedTechnicianId;
        if (request.AssignedTechnicianName != null) ticket.AssignedTechnicianName = request.AssignedTechnicianName;
        if (request.RepairCost.HasValue) ticket.RepairCost = request.RepairCost.Value;

        ticket.UpdatedBy = updatedBy;
        ticket.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();
        return MapToDTO(ticket);
    }

    public async Task<ServiceTicketResponseDTO> ResolveTicketAsync(Guid id, ServiceTicketResolveDTO request, string resolvedBy)
    {
        ServiceTicketEntityClass? ticket = await _dbContext.ServiceTickets.FindAsync(id);
        if (ticket == null)
        {
            throw new EntityNotFoundCException("ServiceTicket", id);
        }

        ticket.Status = "Resolved";
        ticket.ResolutionSummary = request.ResolutionSummary;
        ticket.RepairCost = request.RepairCost;
        ticket.ResolutionDate = DateTime.UtcNow;
        ticket.UpdatedBy = resolvedBy;
        ticket.UpdatedAt = DateTime.UtcNow;

        if (!string.IsNullOrWhiteSpace(ticket.AssetTag) && !string.IsNullOrWhiteSpace(request.NewAssetStatus))
        {
            AssetEntityClass? asset = await _dbContext.Assets
                .FirstOrDefaultAsync(a => a.AssetTag.ToLower() == ticket.AssetTag.Trim().ToLower());
            if (asset != null)
            {
                asset.Status = request.NewAssetStatus;
                asset.UpdatedAt = DateTime.UtcNow;
            }
        }

        await _dbContext.SaveChangesAsync();
        return MapToDTO(ticket);
    }

    public async Task<bool> DeleteTicketAsync(Guid id, string deletedBy)
    {
        ServiceTicketEntityClass? ticket = await _dbContext.ServiceTickets.FindAsync(id);
        if (ticket == null)
        {
            throw new EntityNotFoundCException("ServiceTicket", id);
        }

        ticket.IsDeleted = true;
        ticket.DeletedAt = DateTime.UtcNow;
        ticket.UpdatedBy = deletedBy;

        await _dbContext.SaveChangesAsync();
        return true;
    }

    private static ServiceTicketResponseDTO MapToDTO(ServiceTicketEntityClass ticket)
    {
        return new ServiceTicketResponseDTO
        {
            Id = ticket.Id,
            TicketNumber = ticket.TicketNumber,
            Title = ticket.Title,
            Description = ticket.Description,
            Priority = ticket.Priority,
            Status = ticket.Status,
            IssueCategory = ticket.IssueCategory,
            AssetId = ticket.AssetId,
            AssetTag = ticket.AssetTag,
            RequestedByEmployeeId = ticket.RequestedByEmployeeId,
            RequestedByEmployeeName = ticket.RequestedByEmployeeName,
            AssignedTechnicianId = ticket.AssignedTechnicianId,
            AssignedTechnicianName = ticket.AssignedTechnicianName,
            ResolutionDate = ticket.ResolutionDate,
            ResolutionSummary = ticket.ResolutionSummary,
            RepairCost = ticket.RepairCost,
            CreatedAt = ticket.CreatedAt,
            UpdatedAt = ticket.UpdatedAt
        };
    }
}
