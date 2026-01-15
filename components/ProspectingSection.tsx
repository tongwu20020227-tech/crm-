
import React, { useState } from 'react';
import { MOCK_PROSPECT_CUSTOMERS } from '../mockData';
import { ProspectCustomer, ScheduledVisit } from '../types';
import CallOverlay from './CallOverlay';
import ScheduleVisitModal from './ScheduleVisitModal';
import VisitTypeSelectionModal from './VisitTypeSelectionModal';

interface Props {
  onSchedule: (visit: ScheduledVisit) => void;
  onStartDirectly: (visit: { customerId: string, name: string, type: 'phone' | 'in-person' }) => void;
  onViewReview: (customerId: string, name: string) => void;
  pendingReviewIds: Set<string>;
}

const ProspectingSection: React.FC<Props> = ({ onSchedule, onStartDirectly, onViewReview, pendingReviewIds }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [callingCustomer, setCallingCustomer] = useState<ProspectCustomer | null>(null);
  const [schedulingCustomer, setSchedulingCustomer] = useState<ProspectCustomer | null>(null);
  const [selectingVisitType, setSelectingVisitType] = useState<ProspectCustomer | null>(null);

  const handleStartVisitClick = (customer: ProspectCustomer) => {
    setSelectingVisitType(customer);
  };

  const handleSelectPhone = () => {
    if (selectingVisitType) {
      setCallingCustomer(selectingVisitType);
      setSelectingVisitType(null);
    }
  };

  const handleSelectInPerson = () => {
    if (selectingVisitType) {
      const autoTask: ScheduledVisit = {
        id: 'auto_' + Math.random().toString(36).substr(2, 9),
        customerId: selectingVisitType.id,
        customerName: selectingVisitType.name,
        time: "现在",
        contactName: "王经理",
        contactPhone: "159123482",
        type: 'in-person',
        status: 'active'
      };
      onSchedule(autoTask);
      setSelectingVisitType(null);
    }
  };

  const handleCallConnect = () => {
    if (callingCustomer) {
      onStartDirectly({
        customerId: callingCustomer.id,
        name: callingCustomer.name,
        type: 'phone'
      });
      setCallingCustomer(null);
    }
  };

  return (
    <div className="space-y-6">
      {selectingVisitType && (
        <VisitTypeSelectionModal 
          customerName={selectingVisitType.name}
          onSelectPhone={handleSelectPhone}
          onSelectInPerson={handleSelectInPerson}
          onCancel={() => setSelectingVisitType(null)}
        />
      )}

      {callingCustomer && (
        <CallOverlay 
          name={callingCustomer.name} 
          manager="采购部 王经理" 
          phone="159123482" 
          onConnect={handleCallConnect} 
          onCancel={() => setCallingCustomer(null)} 
        />
      )}

      {schedulingCustomer && (
        <ScheduleVisitModal 
          customer={schedulingCustomer} 
          onClose={() => setSchedulingCustomer(null)}
          onConfirm={(visit) => {
            onSchedule(visit);
            setSchedulingCustomer(null);
          }}
        />
      )}

      {!selectedId && (
        <div className="flex flex-col gap-4">
          <div className="relative">
            <input type="text" placeholder="搜索潜在客户、行业关键黑话..." className="w-full bg-white border-none rounded-2xl py-4 pl-12 pr-4 text-sm shadow-sm ring-1 ring-slate-100 focus:ring-2 ring-blue-500" />
            <svg className="absolute left-4 top-4 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <div className="flex justify-between items-center px-1">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">优质新客户推荐</h2>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {MOCK_PROSPECT_CUSTOMERS.map((prospect) => {
          const isActive = selectedId === prospect.id;
          const hasPendingReview = pendingReviewIds.has(prospect.id);
          return (
            <div
              key={prospect.id}
              className={`transition-all duration-300 border rounded-[32px] overflow-hidden ${
                isActive ? 'bg-white border-blue-200 shadow-2xl scale-[1.02] z-10' : 'bg-white border-slate-100 shadow-sm'
              }`}
            >
              <div className="p-6 cursor-pointer" onClick={() => setSelectedId(isActive ? null : prospect.id)}>
                {hasPendingReview && (
                  <div 
                    onClick={(e) => { e.stopPropagation(); onViewReview(prospect.id, prospect.name); }}
                    className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between group hover:bg-amber-100 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></div>
                      <div>
                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none mb-1">跟进任务待处理</p>
                        <p className="text-xs font-bold text-slate-700">点击进入复盘发放资料</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm group-active:scale-90 transition-transform">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-black text-slate-900 text-lg leading-tight">{prospect.name}</h3>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase bg-blue-100 text-blue-600 mt-1 inline-block">
                      {prospect.industry}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-blue-600">94</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-widest">匹配度</div>
                  </div>
                </div>
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  <p className="text-slate-300 text-xs leading-relaxed font-bold italic">
                    <span className="text-blue-400 font-black">AI 洞察:</span> {prospect.reason}
                  </p>
                </div>
              </div>

              {isActive && (
                <div className="px-6 pb-6 space-y-6 animate-in slide-in-from-top-4 duration-300">
                  <div className="h-px bg-slate-100 w-full"></div>
                  
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                      <h4 className="text-xs font-black text-slate-800 uppercase italic">客户战略背景</h4>
                    </div>
                    <p className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-600 leading-relaxed font-bold italic">“{prospect.background}”</p>
                  </section>

                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1.5 h-4 bg-rose-500 rounded-full"></div>
                      <h4 className="text-xs font-black text-slate-800 uppercase italic">面临的痛点与潜在需求</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1.5">
                        {prospect.scenarios.map((s, i) => (
                          <span key={i} className="text-[9px] px-2 py-1 rounded-lg bg-slate-100 text-slate-500 font-bold uppercase">{s}</span>
                        ))}
                      </div>
                      <div className="p-4 bg-rose-50/30 rounded-2xl border border-rose-100">
                        <p className="text-[9px] text-rose-500 font-black uppercase mb-1">关键痛点分析</p>
                        <p className="text-xs font-bold text-slate-700 leading-relaxed">{prospect.painPoints.focus.join('、')}</p>
                      </div>
                      <div className="p-4 bg-blue-50/30 rounded-2xl border border-blue-100">
                        <p className="text-[9px] text-blue-500 font-black uppercase mb-1">决策关注点</p>
                        <p className="text-xs font-bold text-slate-700 leading-relaxed">{prospect.painPoints.concerns.join('、')}</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                      <h4 className="text-xs font-black text-slate-800 uppercase italic">推荐智能方案</h4>
                    </div>
                    {prospect.solutions.map((sol, i) => (
                      <div key={i} className="bg-emerald-50/20 p-4 rounded-3xl border border-emerald-100 flex gap-4 text-slate-700">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm">{sol.icon}</div>
                        <div className="flex-1">
                          <h5 className="text-sm font-black text-slate-800 mb-0.5">{sol.title}</h5>
                          <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-1">{sol.desc}</p>
                          <span className="text-[9px] text-emerald-600 font-black uppercase tracking-tight">核心增益: {sol.stats}</span>
                        </div>
                      </div>
                    ))}
                  </section>

                  {/* 同行业成功案例模块 - 针对新客户恢复并确保显示 */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1.5 h-4 bg-amber-500 rounded-full"></div>
                      <h4 className="text-xs font-black text-slate-800 uppercase italic">同行业成功案例</h4>
                    </div>
                    <div className="space-y-4">
                      {prospect.cases && prospect.cases.map((c, i) => (
                        <div key={i} className="relative rounded-[32px] overflow-hidden border border-slate-100 shadow-lg min-h-[160px] h-44 group">
                          <img src={c.image} alt={c.company} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent p-6 flex flex-col justify-end">
                            <h6 className="text-white font-black text-base">{c.company}</h6>
                            <p className="text-white/80 text-[11px] font-bold mt-1.5 line-clamp-2 leading-relaxed">{c.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1.5 h-4 bg-slate-900 rounded-full"></div>
                      <h4 className="text-xs font-black text-slate-800 uppercase italic">AI 智能推荐话术</h4>
                    </div>
                    <div className="bg-[#0f172a] p-5 rounded-[28px] border border-slate-800 shadow-xl">
                       <p className="text-[11px] leading-relaxed text-slate-300 font-medium italic">
                         <span className="text-blue-400 font-black mr-1">【破冰切入】</span>针对贵司近期华东区新建体验店的履约压力，我们提供的<span className="text-emerald-400 font-bold underline">送装一体</span>方案已在同行业成功降低了30%的客诉率...
                       </p>
                    </div>
                  </section>

                  <div className="flex gap-3 pt-4">
                    <button 
                      onClick={() => handleStartVisitClick(prospect)}
                      className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                      开始拜访
                    </button>
                    <button 
                      onClick={() => setSchedulingCustomer(prospect)}
                      className="flex-1 bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl font-bold text-xs active:scale-95 transition-all"
                    >
                      安排拜访
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProspectingSection;
