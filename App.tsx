
import React, { useState } from 'react';
import { VisitType, ScheduledVisit, ExistingCustomer, ProspectCustomer } from './types';
import ExistingCustomerSection from './components/ExistingCustomerSection';
import ProspectingSection from './components/ProspectingSection';
import PlannedVisitsSection from './components/PlannedVisitsSection';
import VisitActiveScreen from './components/VisitActiveScreen';
import PostVisitReview from './components/PostVisitReview';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<VisitType>(VisitType.PROSPECTING);
  const [plannedVisits, setPlannedVisits] = useState<ScheduledVisit[]>([]);
  const [activeVisitSession, setActiveVisitSession] = useState<{ id: string, customerId: string, name: string, mode: 'phone' | 'in-person', isExisting: boolean } | null>(null);
  const [reviewData, setReviewData] = useState<{ id: string, customerId: string, name: string, isExisting: boolean } | null>(null);
  
  // Storage for customers that need follow-up actions (keeping their review open)
  const [pendingReviewIds, setPendingReviewIds] = useState<Set<string>>(new Set());

  const addToPlan = (visit: ScheduledVisit) => {
    setPlannedVisits(prev => {
      const isNew = !prev.find(v => v.id === visit.id);
      if (isNew) {
        return [visit, ...prev];
      }
      return prev;
    });
    
    // Auto switch to plan tab only if it's a direct active start
    if (visit.status === 'active' && visit.type === 'in-person') {
       setActiveTab(VisitType.PLANNED);
    }
  };

  const startVisitSession = (visit: ScheduledVisit | { customerId: string, name: string, type: 'phone' | 'in-person' }, isFromMaintenance?: boolean) => {
    setActiveVisitSession({
      id: 'id' in visit ? visit.id : 'direct_' + Math.random().toString(36).substr(2, 9),
      customerId: visit.customerId,
      name: ('customerName' in visit ? visit.customerName : visit.name),
      mode: visit.type,
      isExisting: isFromMaintenance || activeTab === VisitType.MAINTENANCE
    });
  };

  const handleEndVisit = () => {
    if (activeVisitSession) {
      const finishedId = activeVisitSession.id;
      const finishedCustomerId = activeVisitSession.customerId;
      const finishedName = activeVisitSession.name;
      const isExisting = activeVisitSession.isExisting;
      
      setPlannedVisits(prev => prev.map(v => 
        v.id === finishedId ? { ...v, status: 'completed' } : v
      ));
      
      setActiveVisitSession(null);
      setReviewData({ id: finishedId, customerId: finishedCustomerId, name: finishedName, isExisting });
    }
  };

  const handleReviewClose = (action?: 'follow-up' | 'completed') => {
    if (action === 'follow-up' && reviewData) {
      setPendingReviewIds(prev => new Set(prev).add(reviewData.customerId));
    } else if (action === 'completed' && reviewData) {
      // Clear the pending status if finished
      setPendingReviewIds(prev => {
        const next = new Set(prev);
        next.delete(reviewData.customerId);
        return next;
      });
    }
    setReviewData(null);
    // Return to main dashboard
    setActiveTab(action === 'completed' ? VisitType.PROSPECTING : activeTab);
  };

  // 修改此处：支持传入 isExisting 状态，修复 Bug
  const openReview = (customerId: string, name: string, isExisting: boolean) => {
    setReviewData({ id: 'reopened', customerId, name, isExisting });
  };

  if (activeVisitSession) {
    return (
      <VisitActiveScreen 
        customerName={activeVisitSession.name} 
        mode={activeVisitSession.mode} 
        onEnd={handleEndVisit} 
      />
    );
  }

  if (reviewData) {
    return (
      <PostVisitReview 
        customerName={reviewData.name} 
        isExisting={reviewData.isExisting}
        onClose={handleReviewClose}
        onScheduleNext={(visit) => {
          addToPlan(visit);
          // Stay on page
        }}
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case VisitType.MAINTENANCE:
        return (
          <ExistingCustomerSection 
            onSchedule={addToPlan} 
            onStartDirectly={(v) => startVisitSession(v, true)}
            onViewReview={(cid, name) => openReview(cid, name, true)}
            pendingReviewIds={pendingReviewIds}
          />
        );
      case VisitType.PROSPECTING:
        return (
          <ProspectingSection 
            onSchedule={addToPlan} 
            onStartDirectly={(v) => startVisitSession(v, false)}
            onViewReview={(cid, name) => openReview(cid, name, false)}
            pendingReviewIds={pendingReviewIds}
          />
        );
      case VisitType.PLANNED:
        return (
          <PlannedVisitsSection 
            visits={plannedVisits} 
            onStartVisit={(v) => startVisitSession(v)}
          />
        );
      default:
        return <ProspectingSection onSchedule={addToPlan} onStartDirectly={(v) => startVisitSession(v, false)} pendingReviewIds={pendingReviewIds} onViewReview={(cid, name) => openReview(cid, name, false)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-slate-50 shadow-2xl overflow-hidden relative">
      <header className="bg-gradient-to-r from-blue-600 to-blue-500 pt-8 pb-16 px-6 relative">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full border-2 border-white/30 flex items-center justify-center overflow-hidden">
              <svg className="w-10 h-10 text-white/80" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">张一</h1>
              <p className="text-blue-100 text-xs mt-0.5 opacity-90">京津地区 - 消费品一组销售</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            </button>
          </div>
        </div>

        <div className="absolute -bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 border border-white/20 shadow-lg">
          <div className="w-10 h-10 bg-emerald-400 rounded-full flex items-center justify-center shadow-inner">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
          </div>
          <div>
            <h2 className="text-white text-sm font-bold">AI 智能推荐引擎</h2>
            <p className="text-blue-100 text-[10px] opacity-70">正在分析全网商机实时动态...</p>
          </div>
        </div>
      </header>

      <div className="mt-10 px-6">
        <div className="flex bg-slate-200/50 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab(VisitType.PROSPECTING)}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === VisitType.PROSPECTING
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            新客户拓客
          </button>
          <button
            onClick={() => setActiveTab(VisitType.MAINTENANCE)}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === VisitType.MAINTENANCE
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            老客户维护
          </button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 pb-24">
        {renderContent()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 px-6 py-4 max-w-md mx-auto flex justify-around items-center z-20">
        <div 
          onClick={() => setActiveTab(VisitType.PROSPECTING)}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${activeTab === VisitType.PROSPECTING || activeTab === VisitType.MAINTENANCE ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
          <span className="text-[10px] font-bold">首页</span>
        </div>
        <div 
          onClick={() => setActiveTab(VisitType.PLANNED)}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${activeTab === VisitType.PLANNED ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <div className="relative">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
             {plannedVisits.some(v => v.status === 'active') && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>}
          </div>
          <span className="text-[10px] font-bold">拜访计划</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-slate-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          <span className="text-[10px] font-bold">复盘分析</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-slate-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          <span className="text-[10px]">我的</span>
        </div>
      </nav>
    </div>
  );
};

export default App;
