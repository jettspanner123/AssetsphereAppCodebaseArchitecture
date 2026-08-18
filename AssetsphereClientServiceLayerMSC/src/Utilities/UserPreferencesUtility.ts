import { TabType } from '../components/Sidebar';

export default class UserPreferencesUtility {
  public static current: UserPreferencesUtility = new UserPreferencesUtility();

  private activeTabKey = 'assetsphere_active_tab';

  private softwareViewModeKey = 'assetsphere_software_view_mode';
  private softwareGridColumnsKey = 'assetsphere_software_grid_columns';
  private softwareSingleLineKey = 'assetsphere_software_single_line';

  private inventoryViewModeKey = 'assetsphere_inventory_view_mode';
  private inventoryGridColumnsKey = 'assetsphere_inventory_grid_columns';
  private inventorySingleLineKey = 'assetsphere_inventory_single_line';

  private employeesViewModeKey = 'assetsphere_employees_view_mode';
  private employeesGridColumnsKey = 'assetsphere_employees_grid_columns';
  private employeesSingleLineKey = 'assetsphere_employees_single_line';

  private procurementViewModeKey = 'assetsphere_procurement_view_mode';
  private procurementGridColumnsKey = 'assetsphere_procurement_grid_columns';
  private procurementSingleLineKey = 'assetsphere_procurement_single_line';

  private vendorsViewModeKey = 'assetsphere_vendors_view_mode';
  private vendorsGridColumnsKey = 'assetsphere_vendors_grid_columns';
  private vendorsSingleLineKey = 'assetsphere_vendors_single_line';

  private cloudViewModeKey = 'assetsphere_cloud_view_mode';
  private cloudGridColumnsKey = 'assetsphere_cloud_grid_columns';
  private cloudSingleLineKey = 'assetsphere_cloud_single_line';

  // Active Tab Persistence
  public getActiveTab(defaultTab: TabType = 'dashboard'): TabType {
    if (typeof window === 'undefined') return defaultTab;
    const saved = localStorage.getItem(this.activeTabKey);
    return (saved as TabType) || defaultTab;
  }

  public setActiveTab(tab: TabType): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.activeTabKey, tab);
    }
  }

  // Software View Mode
  public getSoftwareViewMode(defaultMode: 'grid' | 'list' = 'grid'): 'grid' | 'list' {
    if (typeof window === 'undefined') return defaultMode;
    const saved = localStorage.getItem(this.softwareViewModeKey);
    return saved === 'list' || saved === 'grid' ? saved : defaultMode;
  }

  public setSoftwareViewMode(mode: 'grid' | 'list'): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.softwareViewModeKey, mode);
    }
  }

  // Software Grid Columns (2 vs 3)
  public getSoftwareGridColumns(defaultCols: 2 | 3 = 3): 2 | 3 {
    if (typeof window === 'undefined') return defaultCols;
    const saved = localStorage.getItem(this.softwareGridColumnsKey);
    if (saved === '2') return 2;
    if (saved === '3') return 3;
    return defaultCols;
  }

  public setSoftwareGridColumns(cols: 2 | 3): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.softwareGridColumnsKey, cols.toString());
    }
  }

  // Software Single-Line Mode
  public getSoftwareSingleLine(defaultVal: boolean = true): boolean {
    if (typeof window === 'undefined') return defaultVal;
    const saved = localStorage.getItem(this.softwareSingleLineKey);
    if (saved !== null) return saved === 'true';
    return defaultVal;
  }

  public setSoftwareSingleLine(val: boolean): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.softwareSingleLineKey, val.toString());
    }
  }

  // Asset Inventory View Mode
  public getInventoryViewMode(defaultMode: 'table' | 'grid' | 'kanban' = 'table'): 'table' | 'grid' | 'kanban' {
    if (typeof window === 'undefined') return defaultMode;
    const saved = localStorage.getItem(this.inventoryViewModeKey);
    if (saved === 'table' || saved === 'grid' || saved === 'kanban') return saved;
    return defaultMode;
  }

  public setInventoryViewMode(mode: 'table' | 'grid' | 'kanban'): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.inventoryViewModeKey, mode);
    }
  }

  // Asset Inventory Grid Columns (2 vs 3)
  public getInventoryGridColumns(defaultCols: 2 | 3 = 3): 2 | 3 {
    if (typeof window === 'undefined') return defaultCols;
    const saved = localStorage.getItem(this.inventoryGridColumnsKey);
    if (saved === '2') return 2;
    if (saved === '3') return 3;
    return defaultCols;
  }

  public setInventoryGridColumns(cols: 2 | 3): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.inventoryGridColumnsKey, cols.toString());
    }
  }

  // Asset Inventory Single-Line Mode
  public getInventorySingleLine(defaultVal: boolean = true): boolean {
    if (typeof window === 'undefined') return defaultVal;
    const saved = localStorage.getItem(this.inventorySingleLineKey);
    if (saved !== null) return saved === 'true';
    return defaultVal;
  }

  public setInventorySingleLine(val: boolean): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.inventorySingleLineKey, val.toString());
    }
  }

  // Employees View Mode
  public getEmployeesViewMode(defaultMode: 'grid' | 'list' = 'grid'): 'grid' | 'list' {
    if (typeof window === 'undefined') return defaultMode;
    const saved = localStorage.getItem(this.employeesViewModeKey);
    return saved === 'list' || saved === 'grid' ? saved : defaultMode;
  }

  public setEmployeesViewMode(mode: 'grid' | 'list'): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.employeesViewModeKey, mode);
    }
  }

  // Employees Grid Columns (2 vs 3)
  public getEmployeesGridColumns(defaultCols: 2 | 3 = 3): 2 | 3 {
    if (typeof window === 'undefined') return defaultCols;
    const saved = localStorage.getItem(this.employeesGridColumnsKey);
    if (saved === '2') return 2;
    if (saved === '3') return 3;
    return defaultCols;
  }

  public setEmployeesGridColumns(cols: 2 | 3): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.employeesGridColumnsKey, cols.toString());
    }
  }

  // Employees Single-Line Mode
  public getEmployeesSingleLine(defaultVal: boolean = true): boolean {
    if (typeof window === 'undefined') return defaultVal;
    const saved = localStorage.getItem(this.employeesSingleLineKey);
    if (saved !== null) return saved === 'true';
    return defaultVal;
  }

  public setEmployeesSingleLine(val: boolean): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.employeesSingleLineKey, val.toString());
    }
  }

  // Procurement View Mode
  public getProcurementViewMode(defaultMode: 'grid' | 'list' = 'grid'): 'grid' | 'list' {
    if (typeof window === 'undefined') return defaultMode;
    const saved = localStorage.getItem(this.procurementViewModeKey);
    return saved === 'list' || saved === 'grid' ? saved : defaultMode;
  }

  public setProcurementViewMode(mode: 'grid' | 'list'): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.procurementViewModeKey, mode);
    }
  }

  // Procurement Grid Columns (2 vs 3)
  public getProcurementGridColumns(defaultCols: 2 | 3 = 3): 2 | 3 {
    if (typeof window === 'undefined') return defaultCols;
    const saved = localStorage.getItem(this.procurementGridColumnsKey);
    if (saved === '2') return 2;
    if (saved === '3') return 3;
    return defaultCols;
  }

  public setProcurementGridColumns(cols: 2 | 3): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.procurementGridColumnsKey, cols.toString());
    }
  }

  // Procurement Single-Line Mode
  public getProcurementSingleLine(defaultVal: boolean = true): boolean {
    if (typeof window === 'undefined') return defaultVal;
    const saved = localStorage.getItem(this.procurementSingleLineKey);
    if (saved !== null) return saved === 'true';
    return defaultVal;
  }

  public setProcurementSingleLine(val: boolean): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.procurementSingleLineKey, val.toString());
    }
  }

  // Vendors View Mode
  public getVendorsViewMode(defaultMode: 'grid' | 'list' = 'grid'): 'grid' | 'list' {
    if (typeof window === 'undefined') return defaultMode;
    const saved = localStorage.getItem(this.vendorsViewModeKey);
    return saved === 'list' || saved === 'grid' ? saved : defaultMode;
  }

  public setVendorsViewMode(mode: 'grid' | 'list'): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.vendorsViewModeKey, mode);
    }
  }

  // Vendors Grid Columns (2 vs 3)
  public getVendorsGridColumns(defaultCols: 2 | 3 = 3): 2 | 3 {
    if (typeof window === 'undefined') return defaultCols;
    const saved = localStorage.getItem(this.vendorsGridColumnsKey);
    if (saved === '2') return 2;
    if (saved === '3') return 3;
    return defaultCols;
  }

  public setVendorsGridColumns(cols: 2 | 3): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.vendorsGridColumnsKey, cols.toString());
    }
  }

  // Vendors Single-Line Mode
  public getVendorsSingleLine(defaultVal: boolean = true): boolean {
    if (typeof window === 'undefined') return defaultVal;
    const saved = localStorage.getItem(this.vendorsSingleLineKey);
    if (saved !== null) return saved === 'true';
    return defaultVal;
  }

  public setVendorsSingleLine(val: boolean): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.vendorsSingleLineKey, val.toString());
    }
  }

  // Cloud View Mode
  public getCloudViewMode(defaultMode: 'grid' | 'list' = 'grid'): 'grid' | 'list' {
    if (typeof window === 'undefined') return defaultMode;
    const saved = localStorage.getItem(this.cloudViewModeKey);
    return saved === 'list' || saved === 'grid' ? saved : defaultMode;
  }

  public setCloudViewMode(mode: 'grid' | 'list'): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.cloudViewModeKey, mode);
    }
  }

  // Cloud Grid Columns (2 vs 3)
  public getCloudGridColumns(defaultCols: 2 | 3 = 3): 2 | 3 {
    if (typeof window === 'undefined') return defaultCols;
    const saved = localStorage.getItem(this.cloudGridColumnsKey);
    if (saved === '2') return 2;
    if (saved === '3') return 3;
    return defaultCols;
  }

  public setCloudGridColumns(cols: 2 | 3): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.cloudGridColumnsKey, cols.toString());
    }
  }

  // Cloud Single-Line Mode
  public getCloudSingleLine(defaultVal: boolean = true): boolean {
    if (typeof window === 'undefined') return defaultVal;
    const saved = localStorage.getItem(this.cloudSingleLineKey);
    if (saved !== null) return saved === 'true';
    return defaultVal;
  }

  public setCloudSingleLine(val: boolean): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.cloudSingleLineKey, val.toString());
    }
  }
}
