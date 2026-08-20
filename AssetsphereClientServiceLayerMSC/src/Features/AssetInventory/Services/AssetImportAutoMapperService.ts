export interface TargetFieldDefinition {
  key: string;
  label: string;
  group: 'core' | 'hardware' | 'procurement' | 'warranty' | 'network' | 'security' | 'financials';
  isRequired?: boolean;
  aliases: string[];
  description: string;
  example: string;
  isOptionA?: boolean; // Belongs to Option A (Core Essential Fields)
}

export const TARGET_ASSET_FIELDS: TargetFieldDefinition[] = [
  // 6 Required Fields (Always Option A & Option B)
  {
    key: 'deviceName',
    label: 'Device Name',
    group: 'core',
    isRequired: true,
    isOptionA: true,
    aliases: ['devicename', 'device name', 'device_name', 'name', 'asset name', 'equipment name', 'host', 'computer name', 'machine name'],
    description: 'Primary naming identifier for the physical/virtual device',
    example: 'MacBook Pro 16" M3 Max',
  },
  {
    key: 'serialNumber',
    label: 'Serial Number',
    group: 'core',
    isRequired: true,
    isOptionA: true,
    aliases: ['serialnumber', 'serial number', 'serial_number', 'serial', 'sn', 's/n', 'service tag', 'imei', 'serial no'],
    description: 'Unique manufacturer hardware serial number or identifier',
    example: 'C02G84YQMD6T',
  },
  {
    key: 'category',
    label: 'Equipment Category',
    group: 'core',
    isRequired: true,
    isOptionA: true,
    aliases: ['category', 'equipment category', 'asset category', 'type', 'equipment type', 'class', 'device category'],
    description: 'Main inventory category classification',
    example: 'Computing, Mobile, Networking',
  },
  {
    key: 'department',
    label: 'Department Allocation',
    group: 'core',
    isRequired: true,
    isOptionA: true,
    aliases: ['department', 'dept', 'department allocation', 'allocated department', 'division', 'cost dept', 'assigned department'],
    description: 'Department or organizational unit holding allocation',
    example: 'Engineering, Sales, Finance',
  },
  {
    key: 'manufacturer',
    label: 'Manufacturer Brand',
    group: 'core',
    isRequired: true,
    isOptionA: true,
    aliases: ['manufacturer', 'brand', 'make', 'oem', 'vendor name', 'manufacturer brand', 'producer'],
    description: 'Original equipment manufacturer or hardware vendor',
    example: 'Apple, Dell, Lenovo, Cisco',
  },
  {
    key: 'purchaseCost',
    label: 'Original Purchase Cost',
    group: 'procurement',
    isRequired: true,
    isOptionA: true,
    aliases: ['purchasecost', 'purchase cost', 'cost', 'original cost', 'price', 'purchase price', 'po cost', 'original purchase cost', 'amount'],
    description: 'Original baseline procurement cost in dollars',
    example: '2499.00',
  },

  // Option A Additional Core Fields (Optional)
  {
    key: 'assetNumber',
    label: 'Asset Tag / ID',
    group: 'core',
    isRequired: false,
    isOptionA: true,
    aliases: ['assetnumber', 'asset number', 'asset tag', 'asset id', 'asset_tag', 'tag id', 'barcode', 'tag'],
    description: 'Internal enterprise asset identification tag',
    example: 'AST-2026-9042',
  },
  {
    key: 'subtype',
    label: 'Subtype / Model Type',
    group: 'core',
    isRequired: false,
    isOptionA: true,
    aliases: ['subtype', 'sub-type', 'device subtype', 'form factor', 'device class'],
    description: 'Specific subcategory classification',
    example: 'Laptop, Server, Monitor',
  },
  {
    key: 'model',
    label: 'Model / Product Spec',
    group: 'core',
    isRequired: false,
    isOptionA: true,
    aliases: ['model', 'model name', 'model number', 'spec', 'product model'],
    description: 'Hardware model designation or spec title',
    example: 'Latitude 7420, ThinkPad X1',
  },
  {
    key: 'lifecycleStatus',
    label: 'Lifecycle Status',
    group: 'core',
    isRequired: false,
    isOptionA: true,
    aliases: ['lifecyclestatus', 'lifecycle status', 'status', 'state', 'condition', 'asset status'],
    description: 'Current operational deployment status',
    example: 'In Use, Inventory, Repair, Retired',
  },
  {
    key: 'currentLocation',
    label: 'Current Location',
    group: 'core',
    isRequired: false,
    isOptionA: true,
    aliases: ['location', 'currentlocation', 'current location', 'site', 'building', 'office location', 'floor'],
    description: 'Physical campus, building, or branch office site',
    example: 'HQ - San Francisco (Floor 8)',
  },
  {
    key: 'assignedToEmployeeName',
    label: 'Assigned Employee Name',
    group: 'core',
    isRequired: false,
    isOptionA: true,
    aliases: ['assigned to', 'assigned employee', 'employee', 'owner', 'assigned user', 'user name', 'custodian', 'employee name'],
    description: 'Full name of active personnel assigned to this device',
    example: 'Sophia Chen',
  },
  {
    key: 'currentValue',
    label: 'Current Book Value',
    group: 'financials',
    isRequired: false,
    isOptionA: true,
    aliases: ['current value', 'currentvalue', 'book value', 'depreciated value', 'net value', 'market value'],
    description: 'Current depreciated valuation of the asset',
    example: '1450.00',
  },

  // Option B: Full Enterprise Fields (Hardware, Procurement, Warranty, Network, Security)
  {
    key: 'cpu',
    label: 'Processor / CPU',
    group: 'hardware',
    isRequired: false,
    isOptionA: false,
    aliases: ['cpu', 'processor', 'chip', 'cpu model'],
    description: 'Installed processor model or generation',
    example: 'Apple M3 Pro / Intel Core i7-1370P',
  },
  {
    key: 'ramGbs',
    label: 'Memory / RAM (GB)',
    group: 'hardware',
    isRequired: false,
    isOptionA: false,
    aliases: ['ram', 'memory', 'ram gb', 'ramgbs', 'system memory'],
    description: 'Total installed system RAM in Gigabytes',
    example: '32',
  },
  {
    key: 'storageGbs',
    label: 'Storage Capacity (GB)',
    group: 'hardware',
    isRequired: false,
    isOptionA: false,
    aliases: ['storage', 'disk', 'hdd', 'ssd', 'storage size', 'capacity', 'storagegbs'],
    description: 'Total internal drive capacity in Gigabytes',
    example: '1024',
  },
  {
    key: 'purchaseDate',
    label: 'Procurement Date',
    group: 'procurement',
    isRequired: false,
    isOptionA: false,
    aliases: ['purchasedate', 'purchase date', 'procurement date', 'po date', 'bought date', 'order date'],
    description: 'Date when the asset was purchased (YYYY-MM-DD)',
    example: '2024-05-18',
  },
  {
    key: 'vendorName',
    label: 'Supplier / Vendor',
    group: 'procurement',
    isRequired: false,
    isOptionA: false,
    aliases: ['vendor', 'supplier', 'vendorname', 'seller', 'distributor'],
    description: 'Authorized vendor or procurement source company',
    example: 'CDW Direct LLC / Dell Enterprise',
  },
  {
    key: 'invoiceNo',
    label: 'Invoice / PO Reference',
    group: 'procurement',
    isRequired: false,
    isOptionA: false,
    aliases: ['invoice', 'invoiceno', 'invoice number', 'po number', 'purchase order', 'po#'],
    description: 'Finance billing invoice or purchase order number',
    example: 'INV-2024-8849',
  },
  {
    key: 'warrantyEnd',
    label: 'Warranty Expiration Date',
    group: 'warranty',
    isRequired: false,
    isOptionA: false,
    aliases: ['warrantyend', 'warranty end', 'warranty expiry', 'coverage end', 'amc end', 'support expiry'],
    description: 'End date of manufacturer warranty or AMC contract',
    example: '2027-05-18',
  },
  {
    key: 'ipAddress',
    label: 'Static / Primary IP Address',
    group: 'network',
    isRequired: false,
    isOptionA: false,
    aliases: ['ip', 'ipaddress', 'ip address', 'ipv4', 'network ip', 'host ip'],
    description: 'Allocated IPv4 or IPv6 network address',
    example: '10.240.12.85',
  },
  {
    key: 'macAddress',
    label: 'Physical MAC Address',
    group: 'network',
    isRequired: false,
    isOptionA: false,
    aliases: ['mac', 'macaddress', 'mac address', 'ethernet mac', 'physical address'],
    description: 'Network interface card hardware MAC address',
    example: '3C:22:FB:44:91:0A',
  },
  {
    key: 'operatingSystem',
    label: 'Operating System & Version',
    group: 'security',
    isRequired: false,
    isOptionA: false,
    aliases: ['os', 'operatingsystem', 'operating system', 'os version', 'platform'],
    description: 'Installed operating system name and version',
    example: 'macOS Sonoma 14.5 / Windows 11 Enterprise',
  },
  {
    key: 'antivirusStatus',
    label: 'EDR / Antivirus Protection State',
    group: 'security',
    isRequired: false,
    isOptionA: false,
    aliases: ['antivirus', 'edr', 'av status', 'security status', 'crowdstrike', 'protection'],
    description: 'Endpoint detection and response agent status',
    example: 'Active / Missing',
  },
];

/**
 * Dedicated Intelligent Auto-Mapping Service
 * Evaluates uploaded column headers against known target fields, synonyms,
 * token similarity, and normalized substrings.
 */
export default class AssetImportAutoMapperService {
  public static current: AssetImportAutoMapperService = new AssetImportAutoMapperService();

  /**
   * Normalizes a string for robust matching (lowercase, removes special chars, trims)
   */
  private normalize(str: string): string {
    return str
      .toLowerCase()
      .replace(/[\-_/\\()\[\].,#:]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Calculates similarity score (0.0 to 1.0) between source header and target candidate
   */
  public calculateMatchScore(sourceHeader: string, targetField: TargetFieldDefinition): number {
    const cleanSource = this.normalize(sourceHeader);
    const compactSource = cleanSource.replace(/\s/g, '');

    // 1. Exact alias match
    for (const alias of targetField.aliases) {
      const cleanAlias = this.normalize(alias);
      if (cleanSource === cleanAlias || compactSource === cleanAlias.replace(/\s/g, '')) {
        return 1.0;
      }
    }

    // 2. Exact label match
    if (cleanSource === this.normalize(targetField.label)) {
      return 1.0;
    }

    // 3. Exact field key match
    if (compactSource === targetField.key.toLowerCase()) {
      return 1.0;
    }

    // 4. Substring / Token Containment Match
    const sourceTokens = cleanSource.split(' ').filter(Boolean);
    for (const alias of targetField.aliases) {
      const aliasTokens = this.normalize(alias).split(' ').filter(Boolean);
      const matches = aliasTokens.filter((token) => sourceTokens.includes(token));
      if (matches.length === aliasTokens.length && aliasTokens.length > 0) {
        return 0.85;
      }
      if (matches.length > 0 && matches.length / aliasTokens.length >= 0.66) {
        return 0.7;
      }
    }

    // 5. In-string inclusion
    if (cleanSource.includes(this.normalize(targetField.label)) || this.normalize(targetField.label).includes(cleanSource)) {
      return 0.6;
    }

    return 0.0;
  }

  /**
   * Automatically derives the optimal field mapping for a list of detected headers.
   * Returns a map of targetFieldKey -> matched sourceHeader (or '' if unmapped).
   */
  public autoMapHeaders(
    detectedHeaders: string[],
    targetFields: TargetFieldDefinition[] = TARGET_ASSET_FIELDS
  ): Record<string, string> {
    const mapping: Record<string, string> = {};
    const usedHeaders = new Set<string>();

    // Pass 1: High confidence matches (score >= 0.8)
    for (const field of targetFields) {
      let bestHeader = '';
      let bestScore = 0;

      for (const header of detectedHeaders) {
        if (usedHeaders.has(header)) continue;
        const score = this.calculateMatchScore(header, field);
        if (score > bestScore && score >= 0.8) {
          bestScore = score;
          bestHeader = header;
        }
      }

      if (bestHeader) {
        mapping[field.key] = bestHeader;
        usedHeaders.add(bestHeader);
      }
    }

    // Pass 2: Secondary confidence matches (score >= 0.6) for unmapped fields
    for (const field of targetFields) {
      if (mapping[field.key]) continue;

      let bestHeader = '';
      let bestScore = 0;

      for (const header of detectedHeaders) {
        if (usedHeaders.has(header)) continue;
        const score = this.calculateMatchScore(header, field);
        if (score > bestScore && score >= 0.6) {
          bestScore = score;
          bestHeader = header;
        }
      }

      if (bestHeader) {
        mapping[field.key] = bestHeader;
        usedHeaders.add(bestHeader);
      } else {
        mapping[field.key] = '';
      }
    }

    return mapping;
  }
}
