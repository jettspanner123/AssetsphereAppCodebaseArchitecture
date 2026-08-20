import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  FileSpreadsheet,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Info,
  Layers,
  HelpCircle,
  FileCheck2,
  RefreshCw,
} from 'lucide-react';
import ModalSharedComponent from '../../../Shared/Components/ModalSharedComponent';
import ButtonSharedComponent from '../../../Shared/Components/ButtonSharedComponent';
import BadgeSharedComponent from '../../../Shared/Components/BadgeSharedComponent';
import AssetImportAutoMapperService, {
  TARGET_ASSET_FIELDS,
  TargetFieldDefinition,
} from '../Services/AssetImportAutoMapperService';
import AssetImportProcessorService, {
  ImportExecutionSummary,
  ParsedCSVData,
} from '../Services/AssetImportProcessorService';
import ImportFieldDropdownComponent from './ImportFieldDropdownComponent';
import { Asset } from '../../../types';

export interface AssetImportModalControllerProps {
  isOpen: boolean;
  onClose: () => void;
  existingAssets: Asset[];
  onImportComplete: (processedAssets: Asset[], summary: ImportExecutionSummary) => void;
}

type WizardStep = 'upload' | 'mapping' | 'results';
type SchemaMode = 'optionA' | 'optionB';

export default function AssetImportModalController({
  isOpen,
  onClose,
  existingAssets,
  onImportComplete,
}: AssetImportModalControllerProps): React.JSX.Element {
  // Wizard State
  const [currentStep, setCurrentStep] = useState<WizardStep>('upload');
  const [schemaMode, setSchemaMode] = useState<SchemaMode>('optionA');
  const [overrideExisting, setOverrideExisting] = useState<boolean>(false);

  // File & Parsing State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedCSVData | null>(null);
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({});
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  // Results State
  const [importSummary, setImportSummary] = useState<ImportExecutionSummary | null>(null);
  const [resultFilter, setResultFilter] = useState<'all' | 'success' | 'skipped' | 'failed'>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset wizard on reopen
  const handleReset = () => {
    setCurrentStep('upload');
    setSelectedFile(null);
    setParsedData(null);
    setFieldMappings({});
    setImportSummary(null);
    setFileError(null);
    setResultFilter('all');
  };

  const handleModalClose = () => {
    handleReset();
    onClose();
  };

  // Process File Input
  const handleFileProcess = (file: File) => {
    setFileError(null);

    // Validate extension
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setFileError('Please upload a standard CSV (.csv) file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text || !text.trim()) {
          setFileError('The selected CSV file is empty.');
          return;
        }

        const parsed = AssetImportProcessorService.current.parseCSV(text);
        if (parsed.headers.length === 0 || parsed.rows.length === 0) {
          setFileError('Could not detect any valid data rows or header columns in this CSV.');
          return;
        }

        setSelectedFile(file);
        setParsedData(parsed);

        // Run intelligent auto-mapping engine
        const autoMapped = AssetImportAutoMapperService.current.autoMapHeaders(
          parsed.headers,
          TARGET_ASSET_FIELDS
        );
        setFieldMappings(autoMapped);

        // Advance to Mapping step
        setCurrentStep('mapping');
      } catch (err: any) {
        setFileError(`Failed to parse CSV file: ${err?.message || 'Unknown error'}`);
      }
    };
    reader.onerror = () => {
      setFileError('An error occurred while reading the file.');
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  // Target fields based on Option A vs Option B
  const activeFields: TargetFieldDefinition[] =
    schemaMode === 'optionA'
      ? TARGET_ASSET_FIELDS.filter((f) => f.isOptionA)
      : TARGET_ASSET_FIELDS;

  // Check required fields completeness
  const requiredFields = activeFields.filter((f) => f.isRequired);
  const missingRequired = requiredFields.filter((f) => !fieldMappings[f.key]);
  const canProceedToImport = missingRequired.length === 0 && parsedData && parsedData.rows.length > 0;

  // Execute Import
  const handleExecuteImport = () => {
    if (!parsedData) return;

    const summary = AssetImportProcessorService.current.processImport(
      parsedData.rows,
      fieldMappings,
      existingAssets,
      overrideExisting
    );

    setImportSummary(summary);
    setCurrentStep('results');
    onImportComplete(summary.processedAssets, summary);
  };

  const autoMappedCount = Object.values(fieldMappings).filter(Boolean).length;

  return (
    <ModalSharedComponent
      isOpen={isOpen}
      onClose={handleModalClose}
      maxWidth="4xl"
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 dark:text-zinc-100">
                Asset Inventory CSV Import
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                Step {currentStep === 'upload' ? '1/3' : currentStep === 'mapping' ? '2/3' : '3/3'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-normal">
              {currentStep === 'upload' && 'Upload your inventory CSV batch file to begin'}
              {currentStep === 'mapping' && 'Map external file columns to AssetSphere enterprise schema'}
              {currentStep === 'results' && 'Import execution summary and row verification report'}
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Step 1: Upload File */}
        {currentStep === 'upload' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv, text/csv"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileProcess(e.target.files[0]);
              }}
              className="hidden"
            />

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                isDragOver
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 scale-[1.01]'
                  : 'border-slate-300 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-900/40 hover:border-slate-400 dark:hover:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-900/70'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 shadow-xs">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-zinc-200 mb-1">
                Drop your CSV file here, or <span className="text-indigo-600 dark:text-indigo-400 underline">browse files</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm">
                Upload any structured CSV spreadsheet. Our intelligent mapper will align your columns in the next step.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-slate-400 dark:text-zinc-500 bg-white dark:bg-zinc-800/80 px-3 py-1 rounded-full border border-slate-200 dark:border-zinc-700/60">
                <span>Accepted Format: .CSV only</span>
              </div>
            </div>

            {fileError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{fileError}</span>
              </div>
            )}

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/80 dark:border-zinc-800/80 flex items-start gap-3">
              <Info className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 dark:text-zinc-400 space-y-1">
                <span className="font-semibold text-slate-800 dark:text-zinc-200 block">
                  Mandatory Required Fields
                </span>
                <span>
                  The 6 required schema attributes (<strong className="text-slate-700 dark:text-zinc-300">Device Name</strong>, <strong className="text-slate-700 dark:text-zinc-300">Serial Number</strong>, <strong className="text-slate-700 dark:text-zinc-300">Equipment Category</strong>, <strong className="text-slate-700 dark:text-zinc-300">Department Allocation</strong>, <strong className="text-slate-700 dark:text-zinc-300">Manufacturer Brand</strong>, and <strong className="text-slate-700 dark:text-zinc-300">Original Purchase Cost</strong>) can be mapped in step 2.
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Field Mapping & Configuration */}
        {currentStep === 'mapping' && parsedData && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-5"
          >
            {/* Header Switcher Section: Styled exactly like Deployment Environment Switcher */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                    Schema Detail Scope
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                    Switch between Essential vs Complete enterprise attributes
                  </div>
                </div>
              </div>

              {/* Segmented Pill Switcher */}
              <div className="flex items-center p-1 rounded-lg bg-slate-200/80 dark:bg-zinc-800 border border-slate-300/60 dark:border-zinc-700/60 h-8.5 w-full sm:w-64">
                <button
                  type="button"
                  onClick={() => setSchemaMode('optionA')}
                  className={`flex-1 py-1 h-6.5 rounded-md text-xs font-medium transition-all cursor-pointer text-center ${
                    schemaMode === 'optionA'
                      ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Option A (Core)
                </button>
                <button
                  type="button"
                  onClick={() => setSchemaMode('optionB')}
                  className={`flex-1 py-1 h-6.5 rounded-md text-xs font-medium transition-all cursor-pointer text-center ${
                    schemaMode === 'optionB'
                      ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Option B (Full)
                </button>
              </div>
            </div>

            {/* File Info Bar & Auto-mapping Status */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs">
              <div className="flex items-center gap-2 truncate">
                <FileSpreadsheet className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="font-medium font-mono text-slate-800 dark:text-zinc-200 truncate">
                  {selectedFile?.name}
                </span>
                <span className="text-slate-400 dark:text-zinc-500">•</span>
                <span className="text-slate-600 dark:text-zinc-400">
                  {parsedData.rows.length} records detected ({parsedData.headers.length} columns)
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  Auto-mapped {autoMappedCount} of {activeFields.length} fields
                </span>
              </div>
            </div>

            {/* Missing Required Warning (if any) */}
            {missingRequired.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Missing Required Field Mappings:</span>
                  <span>
                    Please map the following required column(s):{' '}
                    {missingRequired.map((f) => f.label).join(', ')}
                  </span>
                </div>
              </div>
            )}

            {/* Mapping Grid / Table */}
            <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs">
              <div className="grid grid-cols-12 bg-slate-100/80 dark:bg-zinc-900 px-4 py-2.5 border-b border-slate-200 dark:border-zinc-800 text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-semibold">
                <div className="col-span-6">AssetSphere Schema Field</div>
                <div className="col-span-6">Uploaded CSV Column</div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-zinc-800/80 max-h-80 overflow-y-auto">
                {activeFields.map((field) => {
                  const isMapped = Boolean(fieldMappings[field.key]);
                  return (
                    <div
                      key={field.key}
                      className="grid grid-cols-12 items-center px-4 py-3 gap-3 hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 transition-colors"
                    >
                      {/* Left: Schema Field Info */}
                      <div className="col-span-6 space-y-0.5 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                            {field.label}
                          </span>
                          {field.isRequired ? (
                            <span className="text-[10px] font-medium font-mono px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
                              Required
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400">
                              Optional
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                          {field.description}
                        </p>
                        <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                          e.g. {field.example}
                        </div>
                      </div>

                      {/* Right: Custom Dropdown Component */}
                      <div className="col-span-6">
                        <ImportFieldDropdownComponent
                          detectedHeaders={parsedData.headers}
                          selectedHeader={fieldMappings[field.key] || ''}
                          onSelect={(header) => {
                            setFieldMappings((prev) => ({
                              ...prev,
                              [field.key]: header,
                            }));
                          }}
                          isRequired={field.isRequired}
                          targetFieldLabel={field.label}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Options / Configuration: Override Existing Records Toggle */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  <span>Override Existing Asset Records</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 max-w-xl">
                  When enabled, if an imported serial number or asset tag already exists, its record will be updated with new CSV values. When disabled, duplicates are safely preserved and skipped.
                </p>
              </div>

              {/* Styled Switch Toggle */}
              <button
                type="button"
                onClick={() => setOverrideExisting(!overrideExisting)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  overrideExisting ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-zinc-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    overrideExisting ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              <ButtonSharedComponent
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep('upload')}
                icon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Back to Upload
              </ButtonSharedComponent>

              <ButtonSharedComponent
                variant="primary"
                size="sm"
                onClick={handleExecuteImport}
                disabled={!canProceedToImport}
                className="!bg-[#0C2086] hover:!bg-[#081765] !text-white font-semibold shadow-sm"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Import {parsedData.rows.length} Assets
              </ButtonSharedComponent>
            </div>
          </motion.div>
        )}

        {/* Step 3: Results & Summary */}
        {currentStep === 'results' && importSummary && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-5"
          >
            {/* Metric Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80">
                <div className="text-[11px] font-mono uppercase text-slate-400 dark:text-zinc-500">
                  Total Processed
                </div>
                <div className="text-xl font-bold text-slate-900 dark:text-zinc-100 mt-0.5">
                  {importSummary.totalRows}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                <div className="text-[11px] font-mono uppercase text-emerald-700 dark:text-emerald-400 font-semibold">
                  Successfully Added
                </div>
                <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">
                  {importSummary.successCount}
                </div>
              </div>

              {overrideExisting ? (
                <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40">
                  <div className="text-[11px] font-mono uppercase text-indigo-700 dark:text-indigo-400 font-semibold">
                    Updated Records
                  </div>
                  <div className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mt-0.5">
                    {importSummary.updatedCount}
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                  <div className="text-[11px] font-mono uppercase text-amber-700 dark:text-amber-400 font-semibold">
                    Duplicates Skipped
                  </div>
                  <div className="text-xl font-bold text-amber-700 dark:text-amber-300 mt-0.5">
                    {importSummary.skippedCount}
                  </div>
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
                <div className="text-[11px] font-mono uppercase text-rose-700 dark:text-rose-400 font-semibold">
                  Failed Rows
                </div>
                <div className="text-xl font-bold text-rose-700 dark:text-rose-300 mt-0.5">
                  {importSummary.failedCount}
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-zinc-800 pb-2 text-xs">
              <button
                type="button"
                onClick={() => setResultFilter('all')}
                className={`px-3 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                  resultFilter === 'all'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-zinc-900'
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
                }`}
              >
                All Rows ({importSummary.items.length})
              </button>
              <button
                type="button"
                onClick={() => setResultFilter('success')}
                className={`px-3 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                  resultFilter === 'success'
                    ? 'bg-emerald-600 text-white'
                    : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                }`}
              >
                Success ({importSummary.successCount + importSummary.updatedCount})
              </button>
              <button
                type="button"
                onClick={() => setResultFilter('skipped')}
                className={`px-3 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                  resultFilter === 'skipped'
                    ? 'bg-amber-600 text-white'
                    : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                }`}
              >
                Skipped ({importSummary.skippedCount})
              </button>
              <button
                type="button"
                onClick={() => setResultFilter('failed')}
                className={`px-3 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                  resultFilter === 'failed'
                    ? 'bg-rose-600 text-white'
                    : 'text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                }`}
              >
                Failed ({importSummary.failedCount})
              </button>
            </div>

            {/* Rows Table */}
            <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden">
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800/80 text-xs">
                {importSummary.items
                  .filter((item) => {
                    if (resultFilter === 'all') return true;
                    if (resultFilter === 'success') return item.status === 'success' || item.status === 'updated';
                    if (resultFilter === 'skipped') return item.status === 'skipped';
                    if (resultFilter === 'failed') return item.status === 'failed';
                    return true;
                  })
                  .map((item) => (
                    <div
                      key={item.rowNumber}
                      className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-zinc-900/30"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] text-slate-400 dark:text-zinc-500 w-12">
                          Row {item.rowNumber}
                        </span>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-zinc-100">
                            {item.deviceName}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                            SN: {item.serialNumber} • {item.category}
                          </div>
                          {item.reason && (
                            <div
                              className={`text-[11px] mt-0.5 ${
                                item.status === 'failed'
                                  ? 'text-rose-600 dark:text-rose-400 font-medium'
                                  : 'text-amber-600 dark:text-amber-400'
                              }`}
                            >
                              {item.reason}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        {item.status === 'success' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                            <CheckCircle2 className="w-3 h-3" /> Added
                          </span>
                        )}
                        {item.status === 'updated' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium font-mono px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                            <RefreshCw className="w-3 h-3" /> Updated
                          </span>
                        )}
                        {item.status === 'skipped' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                            <Info className="w-3 h-3" /> Skipped
                          </span>
                        )}
                        {item.status === 'failed' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium font-mono px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                            <AlertCircle className="w-3 h-3" /> Failed
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Final Actions */}
            <div className="flex items-center justify-between pt-2">
              <ButtonSharedComponent
                variant="outline"
                size="sm"
                onClick={handleReset}
                icon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Import Another File
              </ButtonSharedComponent>

              <ButtonSharedComponent
                variant="primary"
                size="sm"
                onClick={handleModalClose}
                className="!bg-[#0C2086] hover:!bg-[#081765] !text-white font-semibold shadow-sm"
                icon={<FileCheck2 className="w-3.5 h-3.5" />}
              >
                Done & View Assets
              </ButtonSharedComponent>
            </div>
          </motion.div>
        )}
      </div>
    </ModalSharedComponent>
  );
}
