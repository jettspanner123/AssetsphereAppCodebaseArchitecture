import { AssetCategory } from '../../../types';

export default class AssetInventoryCON {
  public static readonly TITLE: string = 'Asset Inventory Management';
  public static readonly SUBTITLE: string =
    'Unified control of enterprise hardware, computing nodes, mobile fleets, and infrastructure';

  public static readonly CATEGORIES_LIST: (AssetCategory | 'ALL')[] = [
    'ALL',
    'Computing',
    'Mobile',
    'Peripherals',
    'Storage',
    'Networking',
    'Security Devices',
    'Office Equipment',
    'Infrastructure',
    'Software Assets',
    'Cloud Assets',
  ];

  public static readonly LIFECYCLE_OPTIONS: string[] = [
    'ALL',
    'In Use',
    'Assigned',
    'Inventory',
    'Repair',
    'Maintenance',
    'Retired',
    'Disposed',
  ];
}
