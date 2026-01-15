
import React, { useState } from 'react';
import { MOCK_EXISTING_CUSTOMERS } from '../mockData';
import { ExistingCustomer, ScheduledVisit } from '../types';
import CallOverlay from './CallOverlay';
import ScheduleVisitModal from './ScheduleVisitModal';
import VisitTypeSelectionModal from './VisitTypeSelectionModal';

interface Props {
  onSchedule: (visit: ScheduledVisit) => void;
  onStartDirectly: (visit: { customerId: string, name: string, type: 'phone' | 'in-person' }) => void;
  onViewReview: (customerId: string, name: string) => void;
  pendingReviewIds: Set<string>;
}

const ExistingCustomerSection: React.FC<Props> = ({ onSchedule, onStartDirectly, onViewReview, pendingReviewIds }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [callingCustomer, setCallingCustomer] = useState<ExistingCustomer | null>(null);
  const [schedulingCustomer, setSchedulingCustomer] = useState<ExistingCustomer | null>(null);
  const [selectingVisitType, setSelectingVisitType] = useState<ExistingCustomer | null>(null);

  const handleStartVisitClick = (customer: ExistingCustomer) => {
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
        contactName: selectingVisitType.contacts[0].name,
        contactPhone: selectingVisitType.contacts[0].phone,
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

  const renderSmartScript = (text: string) => {
    const keywords = /WMS|SKU|SOP|DOH|ITO|VMI|Cross-docking|API|弹性云仓|全链路|动销率|货损率|NB-IoT|POC|SOP/g;
    const parts = text.split(/(【.*?】|WMS|SKU|SOP|DOH|ITO|VMI|Cross-docking|API|弹性云仓|全链路|动销率|货损率|NB-IoT|POC|SOP)/g);
    return parts.map((part, i) => {
      if (!part) return null;
      if (part.startsWith('【')) return <span key={i} className="text-blue-400 font-black mr-1">{part}</span>;
      if (part.match(keywords)) return <span key={i} className="text-emerald-400 font-bold border-b border-emerald-900/50">{part}</span>;
      return <span key={i}>{part}</span>;
    });
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
          manager={callingCustomer.contacts[0].name} 
          phone={callingCustomer.contacts[0].phone} 
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

      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">存量客户管家</h2>
        <div className="flex gap-2">
          <span className="text-[10px] px-2 py-1 rounded-lg bg-rose-50 text-rose-600 font-black border border-rose-100 animate-pulse">待救火: 1</span>
        </div>
      </div>

      <div className="space-y-6">
        {MOCK_EXISTING_CUSTOMERS.map((customer) => {
          const isActive = selectedId === customer.id;
          const hasPendingReview = pendingReviewIds.has(customer.id);
          
          return (
            <div
              key={customer.id}
              className={`transition-all duration-500 border rounded-[36px] overflow-hidden ${
                isActive ? 'bg-white border-blue-100 shadow-[0_32px_64px_-16px_rgba(30,58,138,0.1)] scale-[1.02] z-10' : 'bg-white border-slate-100 shadow-sm'
              }`}
            >
              <div className="p-7 cursor-pointer" onClick={() => setSelectedId(isActive ? null : customer.id)}>
                {hasPendingReview && (
                  <div 
                    onClick={(e) => { e.stopPropagation(); onViewReview(customer.id, customer.name); }}
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

                <div className="flex justify-between items-start mb-5">
                  <div className="flex-1">
                    <h3 className="font-black text-slate-900 text-xl leading-tight">{customer.name}</h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-slate-100 text-slate-500 uppercase">{customer.industry}</span>
                      <span className="text-[10px] text-blue-600 font-black tracking-widest uppercase">{customer.years}年长期伙伴</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black italic tracking-tighter text-blue-600">{customer.score}</div>
                    <div className="text-[9px] text-slate-400 font-black uppercase mt-0.5">健康值</div>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border ${customer.scoreTrend === 'down' ? 'bg-rose-50 border-rose-100' : 'bg-blue-50/50 border-blue-100'}`}>
                  <p className="text-xs leading-relaxed font-bold italic text-slate-700">
                    <span className="text-blue-600 font-black mr-1">AI 洞察:</span> {customer.briefTip}
                  </p>
                </div>
              </div>

              {isActive && (
                <div className="px-7 pb-8 space-y-8 animate-in slide-in-from-top-6 duration-500">
                  <div className="h-px bg-slate-100 w-full"></div>
                  
                  {/* 企业基本面 */}
                  <div className="grid grid-cols-2 gap-3 text-slate-700">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[9px] text-slate-400 font-black uppercase mb-1">营收规模</p>
                      <p className="text-sm font-black">{customer.revenue}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[9px] text-slate-400 font-black uppercase mb-1">合作状态</p>
                      <p className="text-sm font-black">{customer.contractStatus.split(' ')[0]}</p>
                    </div>
                  </div>

                  {/* 核心痛点与潜在需求 */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1.5 h-4 bg-rose-500 rounded-full"></div>
                      <h4 className="text-xs font-black text-slate-800 uppercase italic">面临的痛点与潜在需求</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="p-4 bg-rose-50/30 rounded-2xl border border-rose-100">
                        <p className="text-[10px] text-rose-500 font-black uppercase mb-2">当前痛点</p>
                        <ul className="space-y-1.5">
                          {customer.painPoints.current.map((p, i) => (
                            <li key={i} className="text-xs font-bold text-slate-700 flex items-start gap-2">
                              <span className="text-rose-400">•</span>{p}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 bg-blue-50/30 rounded-2xl border border-blue-100">
                        <p className="text-[10px] text-blue-500 font-black uppercase mb-2">潜在升级需求</p>
                        <ul className="space-y-1.5">
                          {customer.painPoints.potential.map((p, i) => (
                            <li key={i} className="text-xs font-bold text-slate-700 flex items-start gap-2">
                              <span className="text-blue-400">•</span>{p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </section>

                  {/* 推荐智能方案 */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                      <h4 className="text-xs font-black text-slate-800 uppercase italic">推荐智能升级方案</h4>
                    </div>
                    <div className="space-y-4">
                      {customer.solutions.map((sol, i) => (
                        <div key={i} className="bg-emerald-50/20 p-5 rounded-[28px] border border-emerald-100 flex gap-4">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm">{sol.icon}</div>
                          <div className="flex-1">
                            <h5 className="text-sm font-black text-slate-800 mb-1">{sol.title}</h5>
                            <p className="text-[11px] text-slate-500 font-medium mb-2">{sol.desc}</p>
                            <span className="text-[10px] bg-white px-2 py-1 rounded-lg border border-emerald-100 text-emerald-600 font-black">成效预测: {sol.stats}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* 同行业成功案例 - 修复图片显示 */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1.5 h-4 bg-amber-500 rounded-full"></div>
                      <h4 className="text-xs font-black text-slate-800 uppercase italic">同行业成功案例</h4>
                    </div>
                    <div className="space-y-4">
                      {customer.cases && customer.cases.map((c, i) => (
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

                  {/* AI 智能推荐话术 */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1.5 h-4 bg-slate-900 rounded-full"></div>
                      <h4 className="text-xs font-black text-slate-800 uppercase italic">AI 智能推荐话术</h4>
                    </div>
                    <div className="bg-[#0f172a] p-6 rounded-[32px] space-y-4 border border-slate-800 relative overflow-hidden shadow-xl">
                      <div className="relative space-y-4 text-slate-300">
                        {customer.scripts.map((script, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="w-1 h-auto bg-blue-500/30 rounded-full"></div>
                            <p className="text-[11px] leading-relaxed font-medium italic">
                              {renderSmartScript(script)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                  
                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={() => handleStartVisitClick(customer)}
                      className="flex-[2] bg-blue-600 text-white py-5 rounded-[24px] font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                      开始拜访
                    </button>
                    <button 
                      onClick={() => setSchedulingCustomer(customer)}
                      className="flex-1 bg-white border border-slate-200 text-slate-600 py-5 rounded-[24px] font-black text-xs active:scale-95 transition-all"
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

export default ExistingCustomerSection;
