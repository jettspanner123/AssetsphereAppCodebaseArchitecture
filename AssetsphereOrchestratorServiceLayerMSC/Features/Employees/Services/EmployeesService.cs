using AssetsphereOrchestratorServiceLayerMSC.Data;
using AssetsphereOrchestratorServiceLayerMSC.Exceptions;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using AssetsphereOrchestratorServiceLayerMSC.Models.Types;
using Microsoft.EntityFrameworkCore;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.Employees.Services;

public sealed class EmployeesService
{
    private readonly AssetsphereDbContext _dbContext;

    public EmployeesService(AssetsphereDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<EmployeeResponseDTO>> GetAllEmployeesAsync(string? department = null, string? search = null)
    {
        IQueryable<EmployeeEntityClass> query = _dbContext.Employees.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(department) && department.ToLower() != "all")
        {
            query = query.Where(e => e.Department.ToLower() == department.Trim().ToLower());
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            string s = search.Trim().ToLower();
            query = query.Where(e =>
                e.FullName.ToLower().Contains(s) ||
                e.Email.ToLower().Contains(s) ||
                e.EmployeeId.ToLower().Contains(s) ||
                e.Designation.ToLower().Contains(s));
        }

        List<EmployeeEntityClass> list = await query.OrderBy(e => e.FullName).ToListAsync();
        return list.Select(MapToDTO).ToList();
    }

    public async Task<EmployeeResponseDTO> GetEmployeeByIdAsync(Guid id)
    {
        EmployeeEntityClass? emp = await _dbContext.Employees.FindAsync(id);
        if (emp == null)
        {
            throw new EntityNotFoundCException("Employee", id);
        }

        return MapToDTO(emp);
    }

    public async Task<List<AssetResponseDTO>> GetAssignedAssetsAsync(string employeeId)
    {
        List<AssetEntityClass> assets = await _dbContext.Assets
            .AsNoTracking()
            .Where(a => a.AssignedEmployeeId == employeeId)
            .ToListAsync();

        return assets.Select(a => new AssetResponseDTO
        {
            Id = a.Id,
            AssetTag = a.AssetTag,
            SerialNumber = a.SerialNumber,
            Category = a.Category,
            Subtype = a.Subtype,
            ModelName = a.ModelName,
            Manufacturer = a.Manufacturer,
            Status = a.Status,
            AssignedEmployeeId = a.AssignedEmployeeId,
            AssignedEmployeeName = a.AssignedEmployeeName,
            AssignedDepartment = a.AssignedDepartment,
            Location = a.Location,
            PurchasePrice = a.PurchasePrice,
            CurrentBookValue = a.CurrentBookValue,
            CreatedAt = a.CreatedAt
        }).ToList();
    }

    public async Task<EmployeeResponseDTO> CreateEmployeeAsync(EmployeeCreateDTO request, string createdBy)
    {
        bool exists = await _dbContext.Employees.AnyAsync(e => e.EmployeeId.ToLower() == request.EmployeeId.Trim().ToLower() || e.Email.ToLower() == request.Email.Trim().ToLower());
        if (exists)
        {
            throw new ValidationCException("An employee with this ID or Email already exists.");
        }

        EmployeeEntityClass newEmp = new EmployeeEntityClass
        {
            Id = Guid.NewGuid(),
            EmployeeId = request.EmployeeId.Trim().ToUpper(),
            FullName = request.FullName.Trim(),
            Email = request.Email.Trim().ToLower(),
            Department = request.Department,
            Designation = request.Designation.Trim(),
            Location = request.Location.Trim(),
            Status = request.Status,
            ManagerName = request.ManagerName?.Trim(),
            ContactPhone = request.ContactPhone?.Trim(),
            AvatarUrl = request.AvatarUrl,
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow
        };

        await _dbContext.Employees.AddAsync(newEmp);
        await _dbContext.SaveChangesAsync();

        return MapToDTO(newEmp);
    }

    public async Task<EmployeeResponseDTO> UpdateEmployeeAsync(Guid id, EmployeeUpdateDTO request, string updatedBy)
    {
        EmployeeEntityClass? emp = await _dbContext.Employees.FindAsync(id);
        if (emp == null)
        {
            throw new EntityNotFoundCException("Employee", id);
        }

        if (request.FullName != null) emp.FullName = request.FullName.Trim();
        if (request.Email != null) emp.Email = request.Email.Trim().ToLower();
        if (!string.IsNullOrWhiteSpace(request.Department)) emp.Department = request.Department.Trim();
        if (request.Designation != null) emp.Designation = request.Designation.Trim();
        if (request.Location != null) emp.Location = request.Location.Trim();
        if (request.Status != null) emp.Status = request.Status;
        if (request.ManagerName != null) emp.ManagerName = request.ManagerName.Trim();
        if (request.ContactPhone != null) emp.ContactPhone = request.ContactPhone.Trim();
        if (request.AvatarUrl != null) emp.AvatarUrl = request.AvatarUrl;

        emp.UpdatedBy = updatedBy;
        emp.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();
        return MapToDTO(emp);
    }

    public async Task<bool> DeleteEmployeeAsync(Guid id, string deletedBy)
    {
        EmployeeEntityClass? emp = await _dbContext.Employees.FindAsync(id);
        if (emp == null)
        {
            throw new EntityNotFoundCException("Employee", id);
        }

        emp.IsDeleted = true;
        emp.DeletedAt = DateTime.UtcNow;
        emp.UpdatedBy = deletedBy;

        await _dbContext.SaveChangesAsync();
        return true;
    }

    private static EmployeeResponseDTO MapToDTO(EmployeeEntityClass emp)
    {
        return new EmployeeResponseDTO
        {
            Id = emp.Id,
            EmployeeId = emp.EmployeeId,
            FullName = emp.FullName,
            Email = emp.Email,
            Department = emp.Department,
            Designation = emp.Designation,
            Location = emp.Location,
            Status = emp.Status,
            ManagerName = emp.ManagerName,
            ContactPhone = emp.ContactPhone,
            AvatarUrl = emp.AvatarUrl,
            AllocatedAssetCount = emp.AllocatedAssetCount,
            CreatedAt = emp.CreatedAt,
            UpdatedAt = emp.UpdatedAt
        };
    }
}
