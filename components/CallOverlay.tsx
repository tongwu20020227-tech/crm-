
import React from 'react';

interface Props {
  name: string;
  manager: string;
  phone: string;
  onConnect: () => void;
  onCancel: () => void;
}

const CallOverlay: React.FC<Props> = ({ name, manager, phone, onConnect, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 w-full max-w-xs rounded-[40px] p-8 text-center text-white space-y-8 shadow-2xl">
        <div className="space-y-2">
          <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">正在呼叫联系人</p>
          <h2 className="text-2xl font-black">{name}</h2>
          <p className="text-blue-400 font-bold">{manager} ({phone})</p>
        </div>
        
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <button onClick={onCancel} className="bg-white/10 text-white py-4 rounded-2xl font-bold hover:bg-white/20">
            取消
          </button>
          <button onClick={onConnect} className="bg-emerald-500 text-white py-4 rounded-2xl font-bold hover:bg-emerald-600">
            连接
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallOverlay;
