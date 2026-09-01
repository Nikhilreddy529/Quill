import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, XCircle, Info, ChevronRight } from 'lucide-react';
import { UnsupportedClaimItem } from '../../types/quill';

interface UnsupportedClaimsBannerProps {
  claims: UnsupportedClaimItem[];
  onDismissClaim?: (id: string) => void;
}

export const UnsupportedClaimsBanner: React.FC<UnsupportedClaimsBannerProps> = ({
  claims,
  onDismissClaim,
}) => {
  if (!claims || claims.length === 0) return null;

  return (
    <div className="bg-rose-50/90 border border-rose-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-bold text-xs text-rose-900">
            {claims.length} AI Grounding & Compliance {claims.length === 1 ? 'Alert' : 'Alerts'} Detected (QTK-023)
          </span>
        </div>
        <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded">
          Approval Blocked
        </span>
      </div>

      <p className="text-[11px] text-rose-800 leading-relaxed">
        DTMC validation detected unsupported scope, fee commitments, or SLA terms that lack direct grounded citations in the uploaded intake resources.
      </p>

      <div className="space-y-2">
        {claims.map(claim => (
          <div key={claim.id} className="p-2.5 bg-white/80 border border-rose-200 rounded-lg text-xs space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-rose-900 font-mono">
                [{claim.type}]
              </span>
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                claim.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {claim.severity}
              </span>
            </div>

            <div className="text-slate-800 font-medium text-[11px]">
              {claim.explanation}
            </div>

            <div className="text-slate-600 text-[10px] bg-slate-50 p-1.5 rounded border border-slate-200 mt-1">
              <span className="font-semibold text-slate-700">Suggested Action: </span>
              {claim.suggestedCorrection}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
