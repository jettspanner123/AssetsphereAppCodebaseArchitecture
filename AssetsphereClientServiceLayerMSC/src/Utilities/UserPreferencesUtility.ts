import { TabType } from '../Types/NavigationType';

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

  private serviceDeskViewModeKey = 'assetsphere_servicedesk_view_mode';
  private serviceDeskGridColumnsKey = 'assetsphere_servicedesk_grid_columns';
  private serviceDeskSingleLineKey = 'assetsphere_servicedesk_single_line';

  private deviceServiceRequestsViewModeKey = 'assetsphere_deviceservicerequests_view_mode';
  private deviceServiceRequestsGridColumnsKey = 'assetsphere_deviceservicerequests_grid_columns';
  private deviceServiceRequestsSingleLineKey = 'assetsphere_deviceservicerequests_single_line';

  private complianceViewModeKey = 'assetsphere_compliance_view_mode';
  private complianceGridColumnsKey = 'assetsphere_compliance_grid_columns';
  private complianceSingleLineKey = 'assetsphere_compliance_single_line';

  private showMockDataKey = 'assetsphere_show_mock_data';

  // Smart Tab-Scoped Storage Accessors
  private getStorageItem(key: string): string | null {
    if (typeof window === 'undefined') return null;
    try {
      const sessionVal = sessionStorage.getItem(key);
      if (sessionVal !== null) return sessionVal;
      const localVal = localStorage.getItem(key);
      if (localVal !== null) {
        sessionStorage.setItem(key, localVal);
        return localVal;
      }
    } catch {
      // Ignore storage access errors
    }
    return null;
  }

  private setStorageItem(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(key, value);
      localStorage.setItem(key, value);
    } catch {
      // Ignore storage access errors
    }
  }

  // Active Tab Persistence
  public getActiveTab(defaultTab: TabType = 'dashboard'): TabType {
    const saved = this.getStorageItem(this.activeTabKey);
    return (saved as TabType) || defaultTab;
  }

  public setActiveTab(tab: TabType): void {
    this.setStorageItem(this.activeTabKey, tab);
  }

  // Software View Mode
  public getSoftwareViewMode(defaultMode: 'grid' | 'list' = 'grid'): 'grid' | 'list' {
    const saved = this.getStorageItem(this.softwareViewModeKey);
    return saved === 'list' || saved === 'grid' ? saved : defaultMode;
  }

  public setSoftwareViewMode(mode: 'grid' | 'list'): void {
    this.setStorageItem(this.softwareViewModeKey, mode);
  }

  // Software Grid Columns (2 vs 3) - Default: 2
  public getSoftwareGridColumns(defaultCols: 2 | 3 = 2): 2 | 3 {
    const saved = this.getStorageItem(this.softwareGridColumnsKey);
    if (saved === '2') return 2;
    if (saved === '3') return 3;
    return defaultCols;
  }

  public setSoftwareGridColumns(cols: 2 | 3): void {
    this.setStorageItem(this.softwareGridColumnsKey, cols.toString());
  }

  // Software Single-Line Mode
  public getSoftwareSingleLine(defaultVal: boolean = true): boolean {
    const saved = this.getStorageItem(this.softwareSingleLineKey);
    if (saved !== null) return saved === 'true';
    return defaultVal;
  }

  public setSoftwareSingleLine(val: boolean): void {
    this.setStorageItem(this.softwareSingleLineKey, val.toString());
  }

  // Asset Inventory View Mode - Default: grid
  public getInventoryViewMode(defaultMode: 'table' | 'grid' = 'grid'): 'table' | 'grid' {
    const saved = this.getStorageItem(this.inventoryViewModeKey);
    if (saved === 'table' || saved === 'grid') return saved;
    return defaultMode;
  }

  public setInventoryViewMode(mode: 'table' | 'grid'): void {
    this.setStorageItem(this.inventoryViewModeKey, mode);
  }

  // Asset Inventory Grid Columns (2 vs 3) - Default: 2
  public getInventoryGridColumns(defaultCols: 2 | 3 = 2): 2 | 3 {
    const saved = this.getStorageItem(this.inventoryGridColumnsKey);
    if (saved === '2') return 2;
    if (saved === '3') return 3;
    return defaultCols;
  }

  public setInventoryGridColumns(cols: 2 | 3): void {
    this.setStorageItem(this.inventoryGridColumnsKey, cols.toString());
  }

  // Asset Inventory Single-Line Mode
  public getInventorySingleLine(defaultVal: boolean = true): boolean {
    const saved = this.getStorageItem(this.inventorySingleLineKey);
    if (saved !== null) return saved === 'true';
    return defaultVal;
  }

  public setInventorySingleLine(val: boolean): void {
    this.setStorageItem(this.inventorySingleLineKey, val.toString());
  }

  // Employees View Mode - Default: grid
  public getEmployeesViewMode(defaultMode: 'grid' | 'list' = 'grid'): 'grid' | 'list' {
    const saved = this.getStorageItem(this.employeesViewModeKey);
    return saved === 'list' || saved === 'grid' ? saved : defaultMode;
  }

  public setEmployeesViewMode(mode: 'grid' | 'list'): void {
    this.setStorageItem(this.employeesViewModeKey, mode);
  }

  // Employees Grid Columns (2 vs 3) - Default: 2
  public getEmployeesGridColumns(defaultCols: 2 | 3 = 2): 2 | 3 {
    const saved = this.getStorageItem(this.employeesGridColumnsKey);
    if (saved === '2') return 2;
    if (saved === '3') return 3;
    return defaultCols;
  }

  public setEmployeesGridColumns(cols: 2 | 3): void {
    this.setStorageItem(this.employeesGridColumnsKey, cols.toString());
  }

  // Employees Single-Line Mode
  public getEmployeesSingleLine(defaultVal: boolean = true): boolean {
    const saved = this.getStorageItem(this.employeesSingleLineKey);
    if (saved !== null) return saved === 'true';
    return defaultVal;
  }

  public setEmployeesSingleLine(val: boolean): void {
    this.setStorageItem(this.employeesSingleLineKey, val.toString());
  }

  // Procurement View Mode - Default: grid
  public getProcurementViewMode(defaultMode: 'grid' | 'list' = 'grid'): 'grid' | 'list' {
    const saved = this.getStorageItem(this.procurementViewModeKey);
    return saved === 'list' || saved === 'grid' ? saved : defaultMode;
  }

  public setProcurementViewMode(mode: 'grid' | 'list'): void {
    this.setStorageItem(this.procurementViewModeKey, mode);
  }

  // Procurement Grid Columns (2 vs 3) - Default: 2
  public getProcurementGridColumns(defaultCols: 2 | 3 = 2): 2 | 3 {
    const saved = this.getStorageItem(this.procurementGridColumnsKey);
    if (saved === '2') return 2;
    if (saved === '3') return 3;
    return defaultCols;
  }

  public setProcurementGridColumns(cols: 2 | 3): void {
    this.setStorageItem(this.procurementGridColumnsKey, cols.toString());
  }

  // Procurement Single-Line Mode
  public getProcurementSingleLine(defaultVal: boolean = true): boolean {
    const saved = this.getStorageItem(this.procurementSingleLineKey);
    if (saved !== null) return saved === 'true';
    return defaultVal;
  }

  public setProcurementSingleLine(val: boolean): void {
    this.setStorageItem(this.procurementSingleLineKey, val.toString());
  }

  // Vendors View Mode - Default: grid
  public getVendorsViewMode(defaultMode: 'grid' | 'list' = 'grid'): 'grid' | 'list' {
    const saved = this.getStorageItem(this.vendorsViewModeKey);
    return saved === 'list' || saved === 'grid' ? saved : defaultMode;
  }

  public setVendorsViewMode(mode: 'grid' | 'list'): void {
    this.setStorageItem(this.vendorsViewModeKey, mode);
  }

  // Vendors Grid Columns (2 vs 3) - Default: 2
  public getVendorsGridColumns(defaultCols: 2 | 3 = 2): 2 | 3 {
    const saved = this.getStorageItem(this.vendorsGridColumnsKey);
    if (saved === '2') return 2;
    if (saved === '3') return 3;
    return defaultCols;
  }

  public setVendorsGridColumns(cols: 2 | 3): void {
    this.setStorageItem(this.vendorsGridColumnsKey, cols.toString());
  }

  // Vendors Single-Line Mode
  public getVendorsSingleLine(defaultVal: boolean = true): boolean {
    const saved = this.getStorageItem(this.vendorsSingleLineKey);
    if (saved !== null) return saved === 'true';
    return defaultVal;
  }

  public setVendorsSingleLine(val: boolean): void {
    this.setStorageItem(this.vendorsSingleLineKey, val.toString());
  }

  // Cloud View Mode - Default: grid
  public getCloudViewMode(defaultMode: 'grid' | 'list' = 'grid'): 'grid' | 'list' {
    const saved = this.getStorageItem(this.cloudViewModeKey);
    return saved === 'list' || saved === 'grid' ? saved : defaultMode;
  }

  public setCloudViewMode(mode: 'grid' | 'list'): void {
    this.setStorageItem(this.cloudViewModeKey, mode);
  }

  // Cloud Grid Columns (2 vs 3) - Default: 2
  public getCloudGridColumns(defaultCols: 2 | 3 = 2): 2 | 3 {
    const saved = this.getStorageItem(this.cloudGridColumnsKey);
    if (saved === '2') return 2;
    if (saved === '3') return 3;
    return defaultCols;
  }

  public setCloudGridColumns(cols: 2 | 3): void {
    this.setStorageItem(this.cloudGridColumnsKey, cols.toString());
  }

  // Cloud Single-Line Mode
  public getCloudSingleLine(defaultVal: boolean = true): boolean {
    const saved = this.getStorageItem(this.cloudSingleLineKey);
    if (saved !== null) return saved === 'true';
    return defaultVal;
  }

  public setCloudSingleLine(val: boolean): void {
    this.setStorageItem(this.cloudSingleLineKey, val.toString());
  }

  // Service Desk View Mode - Default: grid
  public getServiceDeskViewMode(defaultMode: 'grid' | 'list' = 'grid'): 'grid' | 'list' {
    const saved = this.getStorageItem(this.serviceDeskViewModeKey);
    return saved === 'list' || saved === 'grid' ? saved : defaultMode;
  }

  public setServiceDeskViewMode(mode: 'grid' | 'list'): void {
    this.setStorageItem(this.serviceDeskViewModeKey, mode);
  }

  // Service Desk Grid Columns (2 vs 3) - Default: 2
  public getServiceDeskGridColumns(defaultCols: 2 | 3 = 2): 2 | 3 {
    const saved = this.getStorageItem(this.serviceDeskGridColumnsKey);
    if (saved === '2') return 2;
    if (saved === '3') return 3;
    return defaultCols;
  }

  public setServiceDeskGridColumns(cols: 2 | 3): void {
    this.setStorageItem(this.serviceDeskGridColumnsKey, cols.toString());
  }

  // Service Desk Single-Line Mode
  public getServiceDeskSingleLine(defaultVal: boolean = true): boolean {
    const saved = this.getStorageItem(this.serviceDeskSingleLineKey);
    if (saved !== null) return saved === 'true';
    return defaultVal;
  }

  public setServiceDeskSingleLine(val: boolean): void {
    this.setStorageItem(this.serviceDeskSingleLineKey, val.toString());
  }

  // Compliance View Mode - Default: grid
  public getComplianceViewMode(defaultMode: 'grid' | 'list' = 'grid'): 'grid' | 'list' {
    const saved = this.getStorageItem(this.complianceViewModeKey);
    return saved === 'list' || saved === 'grid' ? saved : defaultMode;
  }

  public setComplianceViewMode(mode: 'grid' | 'list'): void {
    this.setStorageItem(this.complianceViewModeKey, mode);
  }

  // Compliance Grid Columns (2 vs 3) - Default: 2
  public getComplianceGridColumns(defaultCols: 2 | 3 = 2): 2 | 3 {
    const saved = this.getStorageItem(this.complianceGridColumnsKey);
    if (saved === '2') return 2;
    if (saved === '3') return 3;
    return defaultCols;
  }

  public setComplianceGridColumns(cols: 2 | 3): void {
    this.setStorageItem(this.complianceGridColumnsKey, cols.toString());
  }

  // Compliance Single-Line Mode
  public getComplianceSingleLine(defaultVal: boolean = true): boolean {
    const saved = this.getStorageItem(this.complianceSingleLineKey);
    if (saved !== null) return saved === 'true';
    return defaultVal;
  }

  public setComplianceSingleLine(val: boolean): void {
    this.setStorageItem(this.complianceSingleLineKey, val.toString());
  }

  // Device Service Requests View Mode - Default: table
  public getDeviceServiceRequestsViewMode(defaultMode: 'table' | 'grid' = 'table'): 'table' | 'grid' {
    const saved = this.getStorageItem(this.deviceServiceRequestsViewModeKey);
    return saved === 'table' || saved === 'grid' ? saved : defaultMode;
  }

  public setDeviceServiceRequestsViewMode(mode: 'table' | 'grid'): void {
    this.setStorageItem(this.deviceServiceRequestsViewModeKey, mode);
  }

  // Device Service Requests Grid Columns (2 vs 3) - Default: 2
  public getDeviceServiceRequestsGridColumns(defaultCols: 2 | 3 = 2): 2 | 3 {
    const saved = this.getStorageItem(this.deviceServiceRequestsGridColumnsKey);
    if (saved === '2') return 2;
    if (saved === '3') return 3;
    return defaultCols;
  }

  public setDeviceServiceRequestsGridColumns(cols: 2 | 3): void {
    this.setStorageItem(this.deviceServiceRequestsGridColumnsKey, cols.toString());
  }

  // Device Service Requests Single-Line Mode - Default: true
  public getDeviceServiceRequestsSingleLine(defaultVal: boolean = true): boolean {
    const saved = this.getStorageItem(this.deviceServiceRequestsSingleLineKey);
    if (saved !== null) return saved === 'true';
    return defaultVal;
  }

  public setDeviceServiceRequestsSingleLine(val: boolean): void {
    this.setStorageItem(this.deviceServiceRequestsSingleLineKey, val.toString());
  }

  // Development Tools: Show Mock Data Preference
  public getShowMockData(defaultVal: boolean = true): boolean {
    const saved = this.getStorageItem(this.showMockDataKey);
    if (saved !== null) return saved === 'true';
    return defaultVal;
  }

  public setShowMockData(val: boolean): void {
    this.setStorageItem(this.showMockDataKey, val.toString());
  }
}
