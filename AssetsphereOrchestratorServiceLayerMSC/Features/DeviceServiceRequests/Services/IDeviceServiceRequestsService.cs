using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.DeviceServiceRequests.Services;

public interface IDeviceServiceRequestsService
{
    Task<List<DeviceServiceRequestResponseDTO>> GetAllRequestsAsync(string? currentUserId, string? currentUserRole, string? status = null);
    Task<List<DeviceServiceRequestResponseDTO>> GetMyRequestsAsync(string userId);
    Task<DeviceServiceRequestResponseDTO?> GetRequestByIdAsync(Guid id);
    Task<DeviceServiceRequestResponseDTO> CreateRequestAsync(
        CreateDeviceServiceRequestDTO dto,
        string requesterUserId,
        string requesterName,
        string requesterEmail,
        string requesterRole
    );
    Task<DeviceServiceRequestResponseDTO?> UpdateRequestStatusAsync(
        Guid id,
        UpdateDeviceServiceRequestStatusDTO dto,
        string updatedBy
    );
    Task<DeviceServiceRequestResponseDTO?> AdminUpdateRequestAsync(
        Guid id,
        AdminUpdateDeviceServiceRequestDTO dto,
        string editorUserId,
        string editorName,
        string editorEmail,
        string editorRole
    );
}
