import React from 'react';
import AssetInventoryScreenController from '../Features/AssetInventory/AssetInventoryScreenController';
import { Asset } from '../Types/AssetType';

export interface AssetInventoryScreenRouteProps {
  assets: Asset[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onSelectAsset: (asset: Asset) => void;
  onOpenAddModal: (templateAsset?: Asset) => void;
  onOpenEditModal?: (asset: Asset) => void;
  onOpenQRBadgeModal: (asset: Asset) => void;
  onExportCSV: () => void;
  onImportAssets?: (importedAssets: Asset[]) => void;
  onDeleteAsset?: (asset: Asset) => void;
  overrideViewMode?: 'table' | 'grid';
  overrideGridColumns?: 2 | 3;
  overrideSingleLine?: boolean;
  overrideComplianceFilter?: string;
  overrideSearchQuery?: string;
  onViewModeChange?: (mode: 'table' | 'grid') => void;
  onGridColumnsChange?: (cols: 2 | 3) => void;
  onSingleLineChange?: (val: boolean) => void;
}

export default function AssetInventoryScreenRoute({
  assets,
  isLoading = false,
  onRefresh,
  onSelectAsset,
  onOpenAddModal,
  onOpenEditModal,
  onOpenQRBadgeModal,
  onExportCSV,
  onImportAssets,
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
      isLoading={isLoading}
      onRefresh={onRefresh}
      onSelectAsset={onSelectAsset}
      onOpenAddModal={onOpenAddModal}
      onOpenEditModal={onOpenEditModal}
      onOpenQRBadgeModal={onOpenQRBadgeModal}
      onExportCSV={onExportCSV}
      onImportAssets={onImportAssets}
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
