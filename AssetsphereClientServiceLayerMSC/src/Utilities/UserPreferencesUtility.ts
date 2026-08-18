import { TabType } from '../components/Sidebar';

export default class UserPreferencesUtility {
  public static current: UserPreferencesUtility = new UserPreferencesUtility();

  private activeTabKey = 'assetsphere_active_tab';
  private softwareViewModeKey = 'assetsphere_software_view_mode';
  private softwareGridColumnsKey = 'assetsphere_software_grid_columns';
  private softwareSingleLineKey = 'assetsphere_software_single_line';

  private inventoryViewModeKey = 'assetsphere_inventory_view_mode';
  private inventorySingleLineKey = 'assetsphere_inventory_single_line';

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
}
