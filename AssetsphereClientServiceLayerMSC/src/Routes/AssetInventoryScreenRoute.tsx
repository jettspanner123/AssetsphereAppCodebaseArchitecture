import React from 'react';
import AssetInventoryScreenController from '../Features/AssetInventory/AssetInventoryScreenController';
import { Asset } from '../types';

export interface AssetInventoryScreenRouteProps {
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
  onOpenAddModal: () => void;
  onOpenQRBadgeModal: (asset: Asset) => void;
  onExportCSV: () => void;
  onImport?: (file: File) => void;
  onDeleteAsset?: (asset: Asset) => void;
  overrideViewMode?: 'table' | 'grid' | 'kanban';
  overrideGridColumns?: 2 | 3;
  overrideSingleLine?: boolean;
  overrideComplianceFilter?: string;
  overrideSearchQuery?: string;
  onViewModeChange?: (mode: 'table' | 'grid' | 'kanban') => void;
  onGridColumnsChange?: (cols: 2 | 3) => void;
  onSingleLineChange?: (val: boolean) => void;
}

export default function AssetInventoryScreenRoute({
  assets,
  onSelectAsset,
  onOpenAddModal,
  onOpenQRBadgeModal,
  onExportCSV,
  onImport,
  onDeleteAsset,
  overrideViewMode,
  overrideGridColumns,
  overrideSingleLine,
  overrideComplianceFilter,
  overrideSearchQuery,
  onViewModeChange,
  onGridColumnsChange,
  onSingleLineChange,
}: AssetInventoryScreenRouteProps): React.JSX.Element {
  return (
    <AssetInventoryScreenController
      assets={assets}
      onSelectAsset={onSelectAsset}
      onOpenAddModal={onOpenAddModal}
      onOpenQRBadgeModal={onOpenQRBadgeModal}
      onExportCSV={onExportCSV}
      onImport={onImport}
      onDeleteAsset={onDeleteAsset}
      overrideViewMode={overrideViewMode}
      overrideGridColumns={overrideGridColumns}
      overrideSingleLine={overrideSingleLine}
      overrideComplianceFilter={overrideComplianceFilter}
      overrideSearchQuery={overrideSearchQuery}
      onViewModeChange={onViewModeChange}
      onGridColumnsChange={onGridColumnsChange}
      onSingleLineChange={onSingleLineChange}
    />
  );
}
