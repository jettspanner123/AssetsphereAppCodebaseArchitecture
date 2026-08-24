export type EmployeeDetailTabKey = 'overview' | 'assigned_assets' | 'activity';

export interface EmployeeDetailTabItem {
  id: EmployeeDetailTabKey;
  label: string;
  description: string;
  iconName: string;
}

export default class EmployeesCON {
  public static readonly TITLE: string = 'Employees & People Directory';
  public static readonly SUBTITLE: string =
    'Personnel profiles, hardware allocations, and department seat usage';

  // Detail Modal Tab Keys
  public static readonly TAB_OVERVIEW: EmployeeDetailTabKey = 'overview';
  public static readonly TAB_ASSIGNED_ASSETS: EmployeeDetailTabKey = 'assigned_assets';
  public static readonly TAB_ACTIVITY: EmployeeDetailTabKey = 'activity';

  // Detail Modal Tab List
  public static readonly TAB_LIST: EmployeeDetailTabItem[] = [
    {
      id: 'overview',
      label: 'Overview & Organization',
      description: 'Corporate identity, hierarchy, cost center, and workplace location',
      iconName: 'Building',
    },
    {
      id: 'assigned_assets',
      label: 'Assigned Hardware Assets',
      description: 'Live physical devices, computing hardware, and peripherals checked out',
      iconName: 'Laptop',
    },
    {
      id: 'activity',
      label: 'Activity & Access Roles',
      description: 'Role permissions, onboarding/offboarding telemetry, and audit compliance',
      iconName: 'Activity',
    },
  ];

  // Department Index to Name Map
  public static readonly DEPARTMENT_NAME_MAP: Record<number, string> = {
    0: 'Engineering',
    1: 'Security Operations',
    2: 'Finance & Procurement',
    3: 'Product Design',
    4: 'IT & Infrastructure',
    5: 'Human Resources',
    6: 'Legal & Compliance',
    7: 'Operations',
  };

  // Department Name to Index Map
  public static readonly DEPARTMENT_INDEX_MAP: Record<string, number> = {
    'Engineering': 0,
    'Security Operations': 1,
    'Finance & Procurement': 2,
    'Product Design': 3,
    'IT & Infrastructure': 4,
    'Human Resources': 5,
    'Legal & Compliance': 6,
    'Operations': 7,
  };

  // Cost Center Descriptions
  public static readonly COST_CENTER_MAP: Record<string, string> = {
    'Engineering': 'CC-ENG-100 (Core Platform & Infrastructure)',
    'Security Operations': 'CC-SEC-200 (SOC & Threat Governance)',
    'Finance & Procurement': 'CC-FIN-300 (Capital Ledger & Treasury)',
    'Product Design': 'CC-PRD-400 (UX & Digital Products)',
    'IT & Infrastructure': 'CC-ITS-500 (Enterprise IT Operations)',
    'Human Resources': 'CC-HRD-600 (People & Talent Management)',
    'Legal & Compliance': 'CC-LEG-700 (Corporate Governance & Risk)',
    'Operations': 'CC-OPS-800 (Global Business Operations)',
  };

  // Employment Type Presets
  public static readonly EMPLOYMENT_TYPES = [
    'Full-time',
    'Contractor',
    'Vendor',
    'Intern',
  ] as const;

  // Designation Quick Presets
  public static readonly DESIGNATION_PRESETS: string[] = [
    'Software Engineer',
    'Senior Backend Engineer',
    'Frontend Specialist',
    'DevOps Architect',
    'Product Designer',
    'Security Analyst',
    'HR Operations Lead',
    'Finance Analyst',
  ];

  // Default Fallback Office
  public static readonly DEFAULT_OFFICE_LOCATION: string = 'HQ Bangalore';
}
