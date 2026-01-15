
import React from 'react';

interface Props {
  customerName: string;
  onSelectPhone: () => void;
  onSelectInPerson: () => void;
  onCancel: () => void;
}

const VisitTypeSelectionModal: React.FC<Props> = ({ customerName, onSelectPhone, onSelectInPerson, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[36px] p-8 shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <h3 className="text-xl font-black text-slate-900 mb-2">选择拜访方式</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">拜访对象：{customerName}</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={onSelectPhone}
            className="group relative bg-blue-600 hover:bg-blue-700 p-6 rounded-[28px] text-left transition-all active:scale-[0.98] shadow-lg shadow-blue-100 overflow-hidden"
          >
            <div className="relative z-10 flex items-center gap-5">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shadow-inner">📞</div>
              <div>
                <h4 className="text-white font-black text-lg">电话拜访</h4>
                <p className="text-blue-100 text-[10px] font-bold opacity-80 mt-0.5">自动录音 · AI智能复盘 · 实时辅助</p>
              </div>
            </div>
            <div className="absolute right-[-10px] top-[-10px] opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
            </div>
          </button>

          <button 
            onClick={onSelectInPerson}
            className="group relative bg-emerald-500 hover:bg-emerald-600 p-6 rounded-[28px] text-left transition-all active:scale-[0.98] shadow-lg shadow-emerald-100 overflow-hidden"
          >
            <div className="relative z-10 flex items-center gap-5">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shadow-inner">🚗</div>
              <div>
                <h4 className="text-white font-black text-lg">线下拜访</h4>
                <p className="text-emerald-50 text-[10px] font-bold opacity-80 mt-0.5">地图导航 · 现场考察 · 面对面签约</p>
              </div>
            </div>
            <div className="absolute right-[-10px] top-[-10px] opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
          </button>
        </div>

        <button 
          onClick={onCancel}
          className="w-full mt-6 py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-colors"
        >
          返回列表
        </button>
      </div>
    </div>
  );
};

export default VisitTypeSelectionModal;
