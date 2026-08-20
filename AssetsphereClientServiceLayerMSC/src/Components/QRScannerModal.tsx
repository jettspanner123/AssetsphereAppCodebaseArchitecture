import React, { useState } from 'react';
import { Asset } from '../types';
import { X, QrCode, Camera, Upload, CheckCircle2, AlertCircle, Search } from 'lucide-react';

interface QRScannerModalProps {
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  assets,
  onSelectAsset,
  onClose,
}) => {
  const [manualCode, setManualCode] = useState('');
  const [scannedAsset, setScannedAsset] = useState<Asset | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isScanning, setIsScanning] = useState(true);

  const handleScanCode = (code: string) => {
    const found = assets.find(
      (a) =>
        a.assetNumber.toLowerCase() === code.trim().toLowerCase() ||
        a.serialNumber.toLowerCase() === code.trim().toLowerCase() ||
        a.barcodeValue === code.trim() ||
        a.companyTag.toLowerCase() === code.trim().toLowerCase()
    );

    if (found) {
      setScannedAsset(found);
      setNotFound(false);
      setIsScanning(false);
    } else {
      setScannedAsset(null);
      setNotFound(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#161618] border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden text-slate-300">
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="font-semibold text-sm text-white flex items-center gap-2">
            <QrCode className="w-4 h-4 text-indigo-400" /> Mobile & Desktop Asset QR Scanner
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Viewfinder simulation */}
          {isScanning && (
            <div className="relative w-full h-56 bg-slate-900 rounded-xl border-2 border-dashed border-indigo-500/50 flex flex-col items-center justify-center space-y-2 overflow-hidden shadow-inner">
              {/* Scanning Laser Animation */}
              <div className="absolute inset-x-0 h-0.5 bg-indigo-400 shadow-[0_0_15px_#818cf8] animate-[pulse_2s_infinite]" />
              <Camera className="w-10 h-10 text-indigo-400/80 animate-pulse" />
              <p className="text-xs text-slate-500 font-mono">Align QR Code or Barcode within viewfinder</p>
            </div>
          )}

          {/* Quick Select Preset Barcode Chips for instant demo */}
          <div className="space-y-1.5 text-xs font-mono">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Quick Demo Scan Shortcuts:</span>
            <div className="flex flex-wrap gap-1.5">
              {assets.slice(0, 4).map((ast) => (
                <button
                  key={ast.id}
                  onClick={() => handleScanCode(ast.assetNumber)}
                  className="px-2.5 py-1 bg-slate-900 border border-slate-800 hover:border-indigo-500 text-indigo-400 rounded text-xs font-medium transition-colors"
                >
                  {ast.assetNumber}
                </button>
              ))}
            </div>
          </div>

          {/* Manual Barcode Input */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs text-slate-400 font-medium">Or enter Asset Tag / Serial / Barcode manually:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScanCode(manualCode)}
                placeholder="e.g. AST-2026-9041 or C02GX920MD6R"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => handleScanCode(manualCode)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Search className="w-3.5 h-3.5" /> Scan
              </button>
            </div>
          </div>

          {/* Result Card */}
          {scannedAsset && (
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" /> Asset Successfully Matched
              </div>
              <div>
                <div className="text-white font-bold text-sm font-sans">{scannedAsset.deviceName}</div>
                <div className="text-slate-500">{scannedAsset.assetNumber} • S/N: {scannedAsset.serialNumber}</div>
                <div className="text-slate-300 mt-1">
                  Owner: <span className="text-indigo-400 font-sans font-semibold">{scannedAsset.assignedToEmployeeName || 'Unassigned'}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectAsset(scannedAsset);
                  onClose();
                }}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
              >
                Open Full Asset Record
              </button>
            </div>
          )}

          {notFound && (
            <div className="p-3 bg-rose-950 border border-rose-900 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> No asset matched the scanned code.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
