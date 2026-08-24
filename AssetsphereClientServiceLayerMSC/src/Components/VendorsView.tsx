import React from 'react';
import { Vendor } from '../Types/VendorType';
import { Building2, Star, ShieldCheck } from 'lucide-react';

interface VendorsViewProps {
  vendors: Vendor[];
}

export const VendorsView: React.FC<VendorsViewProps> = ({ vendors }) => {
  return (
    <div className="p-8 space-y-8 bg-[#0a0a0b] text-slate-300 min-h-screen">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            Enterprise Vendor Directory
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Vendor ratings, SLA response performance, warranty contracts & procurement contacts
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
        {vendors.map((v) => (
          <div key={v.id} className="p-5 bg-[#161618] border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 font-bold shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white">{v.vendorName}</h3>
                <div className="text-[10px] text-slate-500">{v.vendorCategory}</div>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Rating:</span>
                <span className="text-amber-400 font-bold flex items-center gap-1 font-mono">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {v.ratingScore} / 5.0
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contact:</span>
                <span className="text-slate-300">{v.primaryContactName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="text-indigo-400 font-mono">{v.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">SLA Response:</span>
                <span className="text-emerald-400 font-bold font-mono">{v.slaTargetHours} Hours</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
