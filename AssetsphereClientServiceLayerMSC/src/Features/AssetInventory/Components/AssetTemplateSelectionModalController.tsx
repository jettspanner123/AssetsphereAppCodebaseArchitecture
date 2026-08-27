import React, { useState, useMemo } from 'react';
import ModalSharedComponent from '../../../Shared/Components/ModalSharedComponent';
import ButtonSharedComponent from '../../../Shared/Components/ButtonSharedComponent';
import EmptyStateSharedComponent from '../../../Shared/Components/EmptyStateSharedComponent';
import TanstackQueryClientService from '../../../Services/TanstackQueryClientService';
import MockDataSeederService from '../../../Services/MockDataSeederService';
import { Asset } from '../../../Types/AssetType';
import {
  LayoutTemplate,
  Copy,
  Search,
  X,
  Laptop,
  ChevronRight,
  Layers,
} from 'lucide-react';

export type TemplateModalTab = 'standard_templates' | 'existing_assets';

export interface AssetTemplateSelectionModalControllerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate?: (templateAsset: Partial<Asset>) => void;
}

export default function AssetTemplateSelectionModalController({
  isOpen,
  onClose,
  onSelectTemplate,
}: AssetTemplateSelectionModalControllerProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<TemplateModalTab>('existing_assets');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch live asset inventory from backend via Tanstack Query
  const { data: dbAssets = [], isLoading } =
    TanstackQueryClientService.current.assets.useAssetsQuery();

  // Combine live backend assets with local seed mock data if database is initializing
  const allAssets: Asset[] = useMemo(() => {
    return dbAssets.length > 0 ? dbAssets : MockDataSeederService.current.getAssets();
  }, [dbAssets]);

  // Filter existing assets by search query matching any hardware field
  const filteredAssets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return allAssets;

    return allAssets.filter((asset) => {
      const name = asset.deviceName?.toLowerCase() || '';
      const mfg = asset.manufacturer?.toLowerCase() || '';
      const model = asset.model?.toLowerCase() || '';
      const productFamily = asset.productFamily?.toLowerCase() || '';
      const category = asset.category?.toLowerCase() || '';
      const subtype = asset.subtype?.toLowerCase() || '';
      const cpu = (asset.hardwareSpecs?.processor || asset.hardwareSpecs?.cpu || '').toLowerCase();
      const ram = (
        asset.hardwareSpecs?.ram ||
        (asset.hardwareSpecs?.ramGbs ? `${asset.hardwareSpecs.ramGbs} GB` : '')
      ).toLowerCase();
      const storage = (
        asset.hardwareSpecs?.storage ||
        (asset.hardwareSpecs?.storageGbs ? `${asset.hardwareSpecs.storageGbs} GB` : '')
      ).toLowerCase();
      const gpu = (asset.hardwareSpecs?.gpu || asset.hardwareSpecs?.graphics || '').toLowerCase();
      const display = (
        `${asset.hardwareSpecs?.screenSize || ''} ${asset.hardwareSpecs?.resolution || ''}`
      ).toLowerCase();
      const wifi = (asset.hardwareSpecs?.wifiStandard || '').toLowerCase();
      const tpm = (asset.hardwareSpecs?.tpmVersion || '').toLowerCase();

      return (
        name.includes(query) ||
        mfg.includes(query) ||
        model.includes(query) ||
        productFamily.includes(query) ||
        category.includes(query) ||
        subtype.includes(query) ||
        cpu.includes(query) ||
        ram.includes(query) ||
        storage.includes(query) ||
        gpu.includes(query) ||
        display.includes(query) ||
        wifi.includes(query) ||
        tpm.includes(query)
      );
    });
  }, [allAssets, searchQuery]);

  const handleCardClick = (asset: Asset) => {
    // Construct template blueprint with all hardware specs but blank unique IDs
    const templateBlueprint: Partial<Asset> = {
      deviceName: asset.deviceName,
      manufacturer: asset.manufacturer,
      model: asset.model,
      productFamily: asset.productFamily,
      category: asset.category,
      subtype: asset.subtype,
      hardwareSpecs: {
        ...asset.hardwareSpecs,
      },
    };

    onSelectTemplate?.(templateBlueprint);
    onClose();
  };

  return (
    <ModalSharedComponent
      isOpen={isOpen}
      onClose={onClose}
      title="Register Device from Template"
      subtitle="Choose a standardized enterprise hardware template to accelerate asset registration."
      maxWidth="2xl"
      scrollMode="backdrop"
      footer={
        <div className="flex items-center justify-between w-full text-xs text-slate-500 font-mono">
          <span>
            {activeTab === 'existing_assets'
              ? `${filteredAssets.length} hardware blueprint${filteredAssets.length === 1 ? '' : 's'} available`
              : 'Enterprise Catalog'}
          </span>
          <ButtonSharedComponent variant="outline" size="sm" onClick={onClose}>
            Dismiss
          </ButtonSharedComponent>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Full-Width Segmented View Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 h-10 w-full">
          <button
            type="button"
            onClick={() => setActiveTab('standard_templates')}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'standard_templates'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white font-medium'
            }`}
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>Choose Standard Template</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('existing_assets')}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'existing_assets'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white font-medium'
            }`}
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Choose from Existing Assets</span>
          </button>
        </div>

        {/* Tab 1: Standard Templates View (Placeholder) */}
        {activeTab === 'standard_templates' && (
          <div className="py-12 px-6 border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-900 text-slate-400 dark:text-zinc-500 flex items-center justify-center mx-auto">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
              Standard Hardware Catalog
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans leading-relaxed">
              Standardized corporate hardware profiles (Apple, Dell, Lenovo presets) will appear here.
            </p>
          </div>
        )}

        {/* Tab 2: Choose from Existing Assets View */}
        {activeTab === 'existing_assets' && (
          <div className="space-y-3">
            {/* Real-time Search Input Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by device name, manufacturer, CPU, RAM, storage, GPU, display, or WiFi..."
                className="w-full pl-9.5 pr-8 py-2 text-xs bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 rounded-xl text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-1.5 focus:ring-[#0C2086] dark:focus:ring-indigo-500 transition-all font-sans"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 p-0.5 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* List of Structured 3-Column Key-Value Spec Cards */}
            {isLoading && dbAssets.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-zinc-500">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-mono">Fetching enterprise hardware assets...</span>
              </div>
            ) : filteredAssets.length > 0 ? (
              <div className="space-y-3">
                {filteredAssets.map((asset) => {
                  const specs = asset.hardwareSpecs;

                  // 1. Compute specs
                  const cpu = specs?.processor || specs?.cpu || 'Standard Processor';
                  const generation = asset.generation || specs?.generation;

                  // 2. Memory specs
                  const ram =
                    specs?.ram ||
                    (specs?.ramGbs ? `${specs.ramGbs} GB RAM` : '16 GB RAM');

                  // 3. Storage specs
                  const storage =
                    specs?.storage ||
                    (specs?.storageGbs ? `${specs.storageGbs} GB Storage` : '512 GB SSD');

                  // 4. Graphics & Visuals
                  const gpu = specs?.gpu || specs?.graphics || null;
                  const display =
                    specs?.screenSize || specs?.resolution
                      ? `${specs.screenSize || 'Display'} ${specs.resolution ? `(${specs.resolution})` : ''}`.trim()
                      : null;
                  const isTouch = specs?.touchSupport;

                  // 5. Battery & Power
                  const batteryHealth = specs?.batteryHealthPct ?? asset.health?.batteryHealthPct ?? null;

                  // 6. Connectivity & Security
                  const wifi = specs?.wifiStandard || null;
                  const bluetooth = specs?.bluetoothVersion || null;
                  const tpm = specs?.tpmVersion ? `TPM ${specs.tpmVersion}` : null;
                  const hasFingerprint = specs?.fingerprintReader;

                  // Format secondary hardware extras
                  const hardwareExtras = [
                    batteryHealth !== null ? `${batteryHealth}% Bat` : null,
                    wifi ? 'Wi-Fi 6' : null,
                    bluetooth ? 'BT 5.3' : null,
                    tpm ? 'TPM 2.0' : null,
                    hasFingerprint ? 'Biometrics' : null,
                  ]
                    .filter(Boolean)
                    .join(' • ');

                  return (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => handleCardClick(asset)}
                      className="w-full text-left p-4 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 rounded-xl hover:border-[#0C2086]/60 dark:hover:border-indigo-500/60 hover:bg-slate-50/50 dark:hover:bg-zinc-900/40 shadow-xs hover:shadow-sm transition-all cursor-pointer group space-y-3"
                    >
                      {/* Card Header: Device Name & Manufacturer + Category & Subtype Pill */}
                      <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-zinc-900 pb-2.5">
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-slate-900 dark:text-white font-sans group-hover:text-[#0C2086] dark:group-hover:text-indigo-400 transition-colors">
                              {asset.deviceName}
                            </span>
                            {asset.model && (
                              <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500">
                                {asset.model}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 flex-wrap">
                            <span className="font-medium text-slate-700 dark:text-zinc-300">
                              {asset.manufacturer || 'Standard'}
                            </span>
                            {asset.productFamily && (
                              <>
                                <span className="text-slate-300 dark:text-zinc-700">•</span>
                                <span>{asset.productFamily}</span>
                              </>
                            )}
                            {generation && (
                              <>
                                <span className="text-slate-300 dark:text-zinc-700">•</span>
                                <span className="font-mono text-[10px]">{generation}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Category & Subtype Pill + Hover Hint */}
                        <div className="shrink-0 flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200/80 dark:border-zinc-800">
                            {asset.category} • {asset.subtype}
                          </span>
                          <span className="hidden sm:inline-flex items-center text-xs font-semibold text-[#0C2086] dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            Use Template <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>

                      {/* Structured 3-Column Key-Value Spec Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        {/* Column 1: Compute & Memory */}
                        <div className="space-y-2">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
                              Processor / CPU
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-zinc-200 block truncate text-xs" title={cpu}>
                              {cpu}
                            </span>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
                              Memory (RAM)
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-zinc-200 font-mono block text-xs">
                              {ram}
                            </span>
                          </div>
                        </div>

                        {/* Column 2: Storage & Graphics */}
                        <div className="space-y-2 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-zinc-900 pt-2 sm:pt-0 sm:pl-3">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
                              Storage Configuration
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-zinc-200 font-mono block truncate text-xs" title={storage}>
                              {storage}
                            </span>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
                              Graphics (GPU)
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-zinc-200 block truncate text-xs" title={gpu || 'Integrated'}>
                              {gpu || 'Integrated Graphics'}
                            </span>
                          </div>
                        </div>

                        {/* Column 3: Display & Hardware Extras */}
                        <div className="space-y-2 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-zinc-900 pt-2 sm:pt-0 sm:pl-3">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
                              Display / Screen
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-zinc-200 block truncate text-xs">
                              {display || (asset.subtype.includes('Server') ? 'Headless / Rack' : 'Standard Display')}
                              {isTouch && <span className="text-[9px] text-indigo-500 font-bold ml-1 font-mono">TOUCH</span>}
                            </span>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
                              Hardware Features
                            </span>
                            <span className="text-slate-600 dark:text-zinc-400 font-mono text-[11px] block truncate">
                              {hardwareExtras || 'Standard I/O'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Empty State via EmptyStateSharedComponent */
              <EmptyStateSharedComponent
                icon={<Laptop className="w-6 h-6" />}
                title={searchQuery ? 'No matching assets found' : 'No hardware assets available'}
                description={
                  searchQuery
                    ? `No registered devices match "${searchQuery}". Try searching by a different hardware spec or manufacturer.`
                    : 'There are currently no registered hardware devices in the enterprise inventory to clone as a template.'
                }
                actionButton={
                  searchQuery ? (
                    <ButtonSharedComponent
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchQuery('')}
                    >
                      Clear Search Query
                    </ButtonSharedComponent>
                  ) : undefined
                }
              />
            )}
          </div>
        )}
      </div>
    </ModalSharedComponent>
  );
}
