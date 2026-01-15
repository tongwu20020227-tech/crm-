
import React, { useState } from 'react';
import { ScheduledVisit } from '../types';

interface Props {
  customer: any;
  onClose: () => void;
  onConfirm: (visit: ScheduledVisit) => void;
}

const ScheduleVisitModal: React.FC<Props> = ({ customer, onClose, onConfirm }) => {
  const [date, setDate] = useState('2025-12-05');
  const [time, setTime] = useState('14:00');
  const [visitType, setVisitType] = useState<'phone' | 'in-person'>('phone');

  const handleSubmit = () => {
    const visit: ScheduledVisit = {
      id: Math.random().toString(36).substr(2, 9),
      customerId: customer.id,
      customerName: customer.name,
      time: `${date} ${time}`,
      contactName: customer.contacts ? customer.contacts[0].name : "王经理",
      contactPhone: customer.contacts ? customer.contacts[0].phone : "159123482",
      type: visitType,
      status: 'planned'
    };
    onConfirm(visit);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[80] flex items-center justify-center p-6 backdrop-blur-sm">
      <div className="bg-white w-full rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-black text-slate-900 mb-6">安排拜访计划</h3>
        
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold mb-1">拜访对象</p>
            <p className="text-sm font-black text-slate-800">{customer.name}</p>
          </div>

          <div className="space-y-4">
            <div className="flex bg-slate-100 p-1.5 rounded-[20px]">
              <button 
                onClick={() => setVisitType('phone')}
                className={`flex-1 py-3 text-xs font-black rounded-[16px] transition-all flex items-center justify-center gap-2 ${visitType === 'phone' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
              >
                📞 线上电话
              </button>
              <button 
                onClick={() => setVisitType('in-person')}
                className={`flex-1 py-3 text-xs font-black rounded-[16px] transition-all flex items-center justify-center gap-2 ${visitType === 'in-person' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
              >
                🚗 线下拜访
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 font-bold ml-1">选择日期</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl py-4 px-4 text-xs mt-1 focus:ring-2 ring-blue-500 font-bold outline-none" 
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-bold ml-1">选择时间</label>
                <input 
                  type="time" 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl py-4 px-4 text-xs mt-1 focus:ring-2 ring-blue-500 font-bold outline-none" 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <button onClick={onClose} className="bg-slate-100 text-slate-500 py-5 rounded-[24px] font-black text-sm active:scale-95 transition-all">
              取消
            </button>
            <button onClick={handleSubmit} className="bg-blue-600 text-white py-5 rounded-[24px] font-black text-sm shadow-xl shadow-blue-100 active:scale-95 transition-all">
              确认安排
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleVisitModal;
