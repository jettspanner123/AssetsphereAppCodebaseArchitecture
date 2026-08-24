import ApplicationNetworkAPIConfiguration from '../../../Configurations/ApplicationNetworkAPIConfiguration';
import ApplicationLocalStorageService from '../../../Services/ApplicationLocalStorageService';
import { Employee } from '../../../Types/EmployeeType';

export interface BackendEmployeeDTO {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  department: number | string;
  designation: string;
  location: string;
  status: string;
  managerName?: string | null;
  contactPhone?: string | null;
  avatarUrl?: string | null;
  allocatedAssetCount: number;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateEmployeeRequest {
  employeeId: string;
  fullName: string;
  email: string;
  department: number;
  designation: string;
  location: string;
  status?: string;
  managerName?: string;
  contactPhone?: string;
  avatarUrl?: string;
}

export const DEPARTMENT_INDEX_MAP: Record<string, number> = {
  'Engineering': 0,
  'Security Operations': 1,
  'Finance & Procurement': 2,
  'Product Design': 3,
  'IT & Infrastructure': 4,
  'Human Resources': 5,
  'Legal & Compliance': 6,
  'Operations': 7,
};

export const DEPARTMENT_NAME_MAP: Record<number, string> = {
  0: 'Engineering',
  1: 'Security Operations',
  2: 'Finance & Procurement',
  3: 'Product Design',
  4: 'IT & Infrastructure',
  5: 'Human Resources',
  6: 'Legal & Compliance',
  7: 'Operations',
};

export default class EmployeesDirectoryService {
  public static current: EmployeesDirectoryService = new EmployeesDirectoryService();

  private getAuthHeaders(): HeadersInit {
    const config = ApplicationNetworkAPIConfiguration.current.getConfiguration();
    const token = ApplicationLocalStorageService.current.getAccessToken();
    const headers: Record<string, string> = {
      ...config.headers,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  public async getAllEmployees(department?: number, search?: string): Promise<Employee[]> {
    const config = ApplicationNetworkAPIConfiguration.current.getConfiguration();
    const url = new URL(config.endpoints.employees.getAll);
    if (department !== undefined) url.searchParams.set('department', department.toString());
    if (search) url.searchParams.set('search', search);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch employees (HTTP ${response.status})`);
    }

    const json = await response.json();
    const dtos: BackendEmployeeDTO[] = json.data || [];
    return dtos.map(this.mapDtoToEmployee);
  }

  public async getEmployeeById(id: string): Promise<Employee> {
    const config = ApplicationNetworkAPIConfiguration.current.getConfiguration();
    const response = await fetch(config.endpoints.employees.getById(id), {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch employee with ID ${id} (HTTP ${response.status})`);
    }

    const json = await response.json();
    const dto: BackendEmployeeDTO = json.data;
    return this.mapDtoToEmployee(dto);
  }

  public async createEmployee(request: CreateEmployeeRequest): Promise<Employee> {
    const config = ApplicationNetworkAPIConfiguration.current.getConfiguration();
    const response = await fetch(config.endpoints.employees.create, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });

    const json = await response.json();
    if (!response.ok) {
      const errorMsg = json.message || json.title || `Employee creation failed with HTTP ${response.status}`;
      throw new Error(errorMsg);
    }

    const createdDto: BackendEmployeeDTO = json.data;
    return this.mapDtoToEmployee(createdDto);
  }

  public async updateEmployee(id: string, request: Partial<CreateEmployeeRequest>): Promise<Employee> {
    const config = ApplicationNetworkAPIConfiguration.current.getConfiguration();
    const response = await fetch(config.endpoints.employees.update(id), {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });

    const json = await response.json();
    if (!response.ok) {
      const errorMsg = json.message || json.title || `Employee update failed with HTTP ${response.status}`;
      throw new Error(errorMsg);
    }

    const updatedDto: BackendEmployeeDTO = json.data;
    return this.mapDtoToEmployee(updatedDto);
  }

  public async deleteEmployee(id: string): Promise<boolean> {
    const config = ApplicationNetworkAPIConfiguration.current.getConfiguration();
    const response = await fetch(config.endpoints.employees.delete(id), {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const json = await response.json().catch(() => ({}));
      const errorMsg = json.message || `Employee deletion failed with HTTP ${response.status}`;
      throw new Error(errorMsg);
    }

    return true;
  }

  private mapDtoToEmployee(dto: BackendEmployeeDTO): Employee {
    const deptNumber = typeof dto.department === 'number' ? dto.department : parseInt(dto.department, 10);
    const departmentName = typeof deptNumber === 'number' && !isNaN(deptNumber)
      ? (DEPARTMENT_NAME_MAP[deptNumber] || 'Engineering')
      : (typeof dto.department === 'string' ? dto.department : 'Engineering');

    return {
      id: dto.id,
      employeeCode: dto.employeeId || `EMP-${dto.id.slice(0, 6).toUpperCase()}`,
      name: dto.fullName,
      email: dto.email,
      phone: dto.contactPhone || '+1 (555) 019-2834',
      department: departmentName,
      businessUnit: 'Global Operations',
      costCenter: `CC-${(departmentName.slice(0, 3)).toUpperCase()}-100`,
      managerName: dto.managerName || 'Leadership Team',
      designation: dto.designation || 'Specialist',
      officeLocation: dto.location || 'HQ Bangalore',
      floor: 'Floor 4',
      desk: 'D-402',
      employmentType: 'Full-time',
      joiningDate: dto.createdAt ? dto.createdAt.split('T')[0] : '2024-01-15',
      avatarUrl:
        dto.avatarUrl ||
        `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80`,
      assignedAssetCount: dto.allocatedAssetCount || 0,
      isOnboardingPending: false,
      isOffboardingActive: false,
    };
  }
}
