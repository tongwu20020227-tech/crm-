
import React from 'react';
import { ScheduledVisit } from '../types';

interface Props {
  visits: ScheduledVisit[];
  onStartVisit: (visit: ScheduledVisit) => void;
}

const PlannedVisitsSection: React.FC<Props> = ({ visits, onStartVisit }) => {
  if (visits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400 space-y-4">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        </div>
        <p className="text-sm font-bold">暂无已安排的拜访计划</p>
        <p className="text-xs px-10 text-center">在首页选择客户并点击“开始拜访”或“安排拜访”即可添加</p>
      </div>
    );
  }

  const activeVisits = visits.filter(v => v.status === 'active');
  const otherVisits = visits.filter(v => v.status === 'planned');

  const renderVisitCard = (visit: ScheduledVisit, isPriority: boolean) => (
    <div 
      key={visit.id} 
      className={`bg-white p-6 rounded-[36px] border-2 shadow-xl relative overflow-hidden transition-all group ${
        isPriority ? 'border-emerald-500/20 shadow-emerald-500/5' : 'border-slate-100 shadow-slate-100/10'
      }`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-2 ${visit.type === 'phone' ? 'bg-blue-600' : 'bg-emerald-500'}`}></div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-black text-slate-900 text-lg leading-tight mb-1">{visit.customerName}</h3>
            <p className={`text-[10px] font-black uppercase tracking-tight flex items-center gap-1 ${visit.type === 'phone' ? 'text-blue-600' : 'text-emerald-600'}`}>
              {visit.type === 'phone' ? '📞 线上预约通话' : '🚗 线下预约拜访'}
              {isPriority && <span className="ml-1 text-rose-500 animate-pulse">· 实时待办</span>}
            </p>
          </div>
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-inner ${visit.type === 'phone' ? 'bg-blue-50' : 'bg-emerald-50'}`}>
            {visit.type === 'phone' ? '📱' : '📍'}
          </div>
        </div>
        
        <div className="flex items-center gap-3 mb-6">
           <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span className="text-[11px] font-bold text-slate-600">{visit.time}</span>
           </div>
           <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              <span className="text-[11px] font-bold text-slate-600">{visit.contactName}</span>
           </div>
        </div>

        <div className={`grid ${visit.type === 'in-person' ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
          {visit.type === 'in-person' && (
            <button 
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(visit.customerName)}`, '_blank')}
              className="bg-slate-900 text-white py-4 rounded-[20px] font-black text-xs active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
              去导航
            </button>
          )}
          <button 
            onClick={() => onStartVisit(visit)}
            className={`${visit.type === 'phone' ? 'bg-blue-600 shadow-blue-100' : 'bg-emerald-500 shadow-emerald-100'} text-white py-4 rounded-[20px] font-black text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"></path></svg>
            开始{visit.type === 'phone' ? '通话' : '现场'}记录
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">计划中心</h2>
        <div className="flex gap-2">
           <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-1 rounded-lg border border-blue-100">{visits.filter(v => v.status !== 'completed').length} 任务待办</span>
        </div>
      </div>

      {activeVisits.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 pl-2">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
            <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-widest">实时执行中</h3>
          </div>
          {activeVisits.map(visit => renderVisitCard(visit, true))}
        </section>
      )}

      {otherVisits.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 pl-2">
            <div className="w-1.5 h-4 bg-slate-300 rounded-full"></div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">预约计划日程</h3>
          </div>
          {otherVisits.sort((a,b) => a.time.localeCompare(b.time)).map(visit => renderVisitCard(visit, false))}
        </section>
      )}
    </div>
  );
};

export default PlannedVisitsSection;
