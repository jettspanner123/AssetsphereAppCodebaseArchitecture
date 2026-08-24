import { Asset, AssetCategory, AssetSubtype, LifecycleStatus } from '../../../Types/AssetType';

export interface ImportResultItem {
  rowNumber: number;
  deviceName: string;
  serialNumber: string;
  category: string;
  status: 'success' | 'updated' | 'skipped' | 'failed';
  reason?: string;
  asset?: Asset;
}

export interface ImportExecutionSummary {
  totalRows: number;
  successCount: number;
  updatedCount: number;
  skippedCount: number;
  failedCount: number;
  items: ImportResultItem[];
  processedAssets: Asset[];
}

export interface ParsedCSVData {
  headers: string[];
  rows: Record<string, string>[];
}

export default class AssetImportProcessorService {
  public static current: AssetImportProcessorService = new AssetImportProcessorService();

  /**
   * Parse CSV content into headers and row objects
   */
  public parseCSV(text: string): ParsedCSVData {
    const lines: string[][] = [];
    let currentRow: string[] = [];
    let currentField = '';
    let inQuotes = false;

    // Normalize newlines
    const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    for (let i = 0; i < cleanText.length; i++) {
      const char = cleanText[i];
      const nextChar = cleanText[i + 1];

      if (inQuotes) {
        if (char === '"' && nextChar === '"') {
          currentField += '"';
          i++; // Skip escaped quote
        } else if (char === '"') {
          inQuotes = false;
        } else {
          currentField += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          currentRow.push(currentField.trim());
          currentField = '';
        } else if (char === '\n') {
          currentRow.push(currentField.trim());
          if (currentRow.some((f) => f.length > 0)) {
            lines.push(currentRow);
          }
          currentRow = [];
          currentField = '';
        } else {
          currentField += char;
        }
      }
    }

    if (currentField.length > 0 || currentRow.length > 0) {
      currentRow.push(currentField.trim());
      if (currentRow.some((f) => f.length > 0)) {
        lines.push(currentRow);
      }
    }

    if (lines.length === 0) {
      return { headers: [], rows: [] };
    }

    const headers = lines[0].map((h) => h.replace(/^["']|["']$/g, '').trim()).filter(Boolean);
    const rows: Record<string, string>[] = [];

    for (let r = 1; r < lines.length; r++) {
      const line = lines[r];
      const rowObj: Record<string, string> = {};
      let hasData = false;

      headers.forEach((header, index) => {
        const val = line[index] !== undefined ? line[index] : '';
        rowObj[header] = val;
        if (val.trim()) hasData = true;
      });

      if (hasData) {
        rows.push(rowObj);
      }
    }

    return { headers, rows };
  }

  /**
   * Execute the import transformation, validation, and conflict resolution
   */
  public processImport(
    parsedRows: Record<string, string>[],
    mapping: Record<string, string>,
    existingAssets: Asset[],
    overrideExisting: boolean
  ): ImportExecutionSummary {
    const items: ImportResultItem[] = [];
    const processedAssets: Asset[] = [...existingAssets];
    let successCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    const existingBySerial = new Map<string, Asset>();
    const existingByTag = new Map<string, Asset>();

    existingAssets.forEach((asset) => {
      if (asset.serialNumber) {
        existingBySerial.set(asset.serialNumber.trim().toLowerCase(), asset);
      }
      if (asset.assetNumber) {
        existingByTag.set(asset.assetNumber.trim().toLowerCase(), asset);
      }
    });

    parsedRows.forEach((row, index) => {
      const rowNum = index + 2; // Accounting for 1-based index + header row

      // Helper to retrieve mapped field value from row
      const getValue = (key: string): string => {
        const sourceHeader = mapping[key];
        if (!sourceHeader || !row[sourceHeader]) return '';
        return String(row[sourceHeader]).trim();
      };

      const deviceName = getValue('deviceName');
      const serialNumber = getValue('serialNumber');
      const category = getValue('category');
      const department = getValue('department');
      const manufacturer = getValue('manufacturer');
      const purchaseCostStr = getValue('purchaseCost');

      // 1. Required Field Validations
      const missingFields: string[] = [];
      if (!deviceName) missingFields.push('Device Name');
      if (!serialNumber) missingFields.push('Serial Number');
      if (!category) missingFields.push('Equipment Category');
      if (!department) missingFields.push('Department Allocation');
      if (!manufacturer) missingFields.push('Manufacturer Brand');
      if (!purchaseCostStr) missingFields.push('Original Purchase Cost');

      if (missingFields.length > 0) {
        failedCount++;
        items.push({
          rowNumber: rowNum,
          deviceName: deviceName || '—',
          serialNumber: serialNumber || '—',
          category: category || '—',
          status: 'failed',
          reason: `Missing required field(s): ${missingFields.join(', ')}`,
        });
        return;
      }

      const purchaseCost = parseFloat(purchaseCostStr.replace(/[^0-9.-]+/g, '')) || 0;
      const assetNumber = getValue('assetNumber') || `AST-IMP-${Math.floor(1000 + Math.random() * 9000)}`;

      // 2. Duplicate Detection
      const serialKey = serialNumber.trim().toLowerCase();
      const tagKey = assetNumber.trim().toLowerCase();
      const existingMatch = existingBySerial.get(serialKey) || existingByTag.get(tagKey);

      if (existingMatch) {
        if (!overrideExisting) {
          skippedCount++;
          items.push({
            rowNumber: rowNum,
            deviceName,
            serialNumber,
            category,
            status: 'skipped',
            reason: `Existing record found with Serial "${serialNumber}" (Skipped due to duplicate policy)`,
            asset: existingMatch,
          });
          return;
        } else {
          // Update existing asset
          const updatedAsset: Asset = {
            ...existingMatch,
            deviceName,
            serialNumber,
            category: (category as AssetCategory) || existingMatch.category,
            department,
            manufacturer,
            procurement: {
              ...existingMatch.procurement,
              purchaseCost: purchaseCost || existingMatch.procurement.purchaseCost,
              purchaseDate: getValue('purchaseDate') || existingMatch.procurement.purchaseDate,
              vendorName: getValue('vendorName') || existingMatch.procurement.vendorName,
              invoiceNo: getValue('invoiceNo') || existingMatch.procurement.invoiceNo,
            },
            currentValue: getValue('currentValue')
              ? parseFloat(getValue('currentValue').replace(/[^0-9.-]+/g, '')) || purchaseCost
              : purchaseCost,
            assignedToEmployeeName: getValue('assignedToEmployeeName') || existingMatch.assignedToEmployeeName,
            currentLocation: getValue('currentLocation') || existingMatch.currentLocation,
            lifecycleStatus: (getValue('lifecycleStatus') as LifecycleStatus) || existingMatch.lifecycleStatus,
            subtype: (getValue('subtype') as AssetSubtype) || existingMatch.subtype,
            model: getValue('model') || existingMatch.model,
          };

          const targetIndex = processedAssets.findIndex((a) => a.id === existingMatch.id);
          if (targetIndex !== -1) {
            processedAssets[targetIndex] = updatedAsset;
          }

          updatedCount++;
          items.push({
            rowNumber: rowNum,
            deviceName,
            serialNumber,
            category,
            status: 'updated',
            reason: `Successfully updated existing asset (${existingMatch.assetNumber})`,
            asset: updatedAsset,
          });
          return;
        }
      }

      // 3. Construct new Asset
      const newAsset: Asset = {
        id: `AST-IMP-${Date.now().toString().slice(-4)}-${index}`,
        assetNumber: assetNumber,
        barcodeValue: `BAR-${Math.floor(100000 + Math.random() * 900000)}`,
        serialNumber,
        companyTag: `TAG-${serialNumber.slice(-4).toUpperCase()}`,
        hostname: `${deviceName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.corp`,
        deviceName,
        category: (category as AssetCategory) || 'Computing',
        subtype: (getValue('subtype') as AssetSubtype) || 'Laptop',
        manufacturer,
        brand: manufacturer,
        model: getValue('model') || 'Enterprise Spec',
        productFamily: 'Enterprise Fleet',
        sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        releaseYear: new Date().getFullYear(),
        lifecycleStatus: (getValue('lifecycleStatus') as LifecycleStatus) || 'In Use',
        currentLocation: getValue('currentLocation') || 'HQ - San Francisco',
        department,
        businessUnit: 'Corporate Operations',
        costCenter: 'CC-GENERAL',
        assignedToEmployeeName: getValue('assignedToEmployeeName') || undefined,
        assignedDate: getValue('assignedToEmployeeName') ? new Date().toISOString().split('T')[0] : undefined,
        currentValue: getValue('currentValue')
          ? parseFloat(getValue('currentValue').replace(/[^0-9.-]+/g, '')) || purchaseCost
          : purchaseCost,
        depreciationMethod: 'Straight Line',
        usefulLifeYears: 4,
        salvageValue: Math.round(purchaseCost * 0.1),
        totalCostOfOwnership: purchaseCost,
        procurement: {
          purchaseDate: getValue('purchaseDate') || new Date().toISOString().split('T')[0],
          purchaseOrderNo: getValue('invoiceNo') || `PO-IMP-${Math.floor(1000 + Math.random() * 9000)}`,
          vendorName: getValue('vendorName') || 'Corporate Direct',
          invoiceNo: getValue('invoiceNo') || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
          invoiceDate: getValue('purchaseDate') || new Date().toISOString().split('T')[0],
          purchaseCost: purchaseCost,
          gstPct: 18,
          currency: 'USD',
          budgetCode: 'CAPEX-IT',
          costCenter: 'CC-GENERAL',
          isCapitalized: true,
          procurementMethod: 'Direct Purchase',
        },
        warranty: {
          warrantyStart: getValue('purchaseDate') || new Date().toISOString().split('T')[0],
          warrantyEnd: getValue('warrantyEnd') || '2027-12-31',
          hasExtendedWarranty: false,
          vendorContactName: 'Enterprise Hardware Support',
          supportPhone: '+1-800-555-0199',
          slaDetails: 'Next Business Day Onsite',
          responseTimeHours: 24,
          escalationContact: 'support-tier2@vendor.com',
        },
        security: {
          operatingSystem: getValue('operatingSystem') || 'macOS / Windows 11',
          antivirusStatus: (getValue('antivirusStatus') as any) || 'Active',
          vpnClientStatus: 'Installed',
          bitlockerEnabled: true,
          encryptionStatus: 'Encrypted',
          patchLevel: 'Latest Baseline',
          securityBaselineScore: 95,
          complianceScore: 92,
          isCompliant: true,
        },
        network: {
          ipAddress: getValue('ipAddress') || undefined,
          officeLocation: getValue('currentLocation') || 'HQ - San Francisco',
        },
        health: {
          overallScore: 94,
          deviceAgeMonths: 1,
          repairCount: 0,
          warrantyStatus: 'Active',
          downtimeHoursTotal: 0,
          performanceIndex: 96,
          securityCompliancePct: 100,
        },
        timeline: [
          {
            id: `TL-IMP-${Date.now()}-${index}`,
            timestamp: new Date().toISOString(),
            eventType: 'Received',
            title: 'Bulk CSV Inventory Ingestion',
            description: `Imported via intelligent schema mapper from batch file.`,
            actorName: 'Asset Inventory Admin',
          },
        ],
        chainOfCustody: [],
      };

      processedAssets.unshift(newAsset);
      existingBySerial.set(serialKey, newAsset);
      existingByTag.set(tagKey, newAsset);
      successCount++;

      items.push({
        rowNumber: rowNum,
        deviceName,
        serialNumber,
        category,
        status: 'success',
        asset: newAsset,
      });
    });

    return {
      totalRows: parsedRows.length,
      successCount,
      updatedCount,
      skippedCount,
      failedCount,
      items,
      processedAssets,
    };
  }
}
