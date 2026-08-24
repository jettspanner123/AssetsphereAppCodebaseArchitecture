import { Asset } from '../Types/AssetType';

export default class ExportUtility {
  public static current: ExportUtility = new ExportUtility();

  public exportAssetsToCSV(assets: Asset[]): void {
    const headers = ['Asset ID', 'Device Name', 'Category', 'Serial Number', 'Owner', 'Value ($)', 'Health Score'];
    const rows = assets.map((a) => [
      a.assetNumber,
      `"${a.deviceName.replace(/"/g, '""')}"`,
      a.category,
      a.serialNumber,
      a.assignedToEmployeeName || 'Unassigned',
      a.currentValue,
      `${a.health?.overallScore || 0}%`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `AssetSphere_Inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
