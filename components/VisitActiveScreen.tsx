
import React, { useState, useEffect } from 'react';

interface VisitActiveScreenProps {
  customerName: string;
  managerInfo?: string;
  mode: 'phone' | 'in-person';
  onEnd: () => void;
}

const VisitActiveScreen: React.FC<VisitActiveScreenProps> = ({ customerName, managerInfo, mode, onEnd }) => {
  const [seconds, setSeconds] = useState(0);
  const [transcripts, setTranscripts] = useState<{role: string, text: string}[]>([]);
  const [aiTips, setAiTips] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(mode === 'phone');
  
  // 新增：说话时长统计
  const [meTime, setMeTime] = useState(0);
  const [customerTime, setCustomerTime] = useState(0);

  useEffect(() => {
    let timer: any;
    let messageTimer: any;

    if (isRecording) {
      timer = setInterval(() => setSeconds(s => s + 1), 1000);
      
      const intervals = [
        { time: 5, role: '客户', text: '我们现在比较头疼的是最后一公里的配送费太高了。', tip: '建议切入：展示我们的“下沉市场路由优化”数据。', duration: 4 },
        { time: 10, role: '我', text: '其实针对这个问题，我们刚上线的弹性路由策略可以将成本降低15%左右。', duration: 6 },
        { time: 18, role: '客户', text: '哦对对，你说的那个 BC 同仓确实能解决我们的库存冗余问题。', tip: '★ 识别到正面共鸣！建议强化 ROI 说明。', duration: 5 },
        { time: 25, role: '客户', text: '如果下个月就开始试点的话，你们的技术对接最快要多久？', tip: '关键商机！建议回答：标准 API 最快 3 天。', duration: 4 },
      ];

      messageTimer = setInterval(() => {
        const msg = intervals.find(i => i.time === seconds);
        if (msg) {
          setTranscripts(prev => [...prev, { role: msg.role, text: msg.text }]);
          if (msg.tip) setAiTips(prev => [msg.tip, ...prev]);
          
          // 模拟统计时长
          if (msg.role === '我') {
            setMeTime(prev => prev + (msg.duration || 2));
          } else {
            setCustomerTime(prev => prev + (msg.duration || 2));
          }
        }
      }, 1000);
    }

    return () => {
      clearInterval(timer);
      clearInterval(messageTimer);
    };
  }, [seconds, isRecording]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isPhone = mode === 'phone';

  return (
    <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col text-white max-w-md mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className={`${isPhone ? 'bg-slate-900' : 'bg-emerald-950'} px-6 pt-8 pb-10 border-b border-white/10 relative transition-colors duration-500`}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <button onClick={onEnd} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <div>
              <h2 className="text-xl font-black tracking-tight">{customerName}</h2>
              <p className={`${isPhone ? 'text-blue-400' : 'text-emerald-400'} text-xs font-bold mt-1 uppercase tracking-widest`}>
                {isPhone ? '正在通话录音' : '现场会议记录中'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-mono font-black ${isPhone ? 'text-blue-400' : 'text-emerald-400'}`}>{formatTime(seconds)}</div>
          </div>
        </div>

        {/* 说话时长统计看板 */}
        <div className="flex gap-4 mb-2">
           <div className="flex-1 bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">我方发言</p>
              <p className="text-sm font-black text-blue-400">{formatTime(meTime)}</p>
           </div>
           <div className="flex-1 bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">客户发言</p>
              <p className="text-sm font-black text-emerald-400">{formatTime(customerTime)}</p>
           </div>
        </div>

        {/* AI Agent Overlay Tip */}
        {aiTips.length > 0 && (
          <div className="absolute -bottom-6 left-6 right-6 bg-white rounded-2xl p-4 flex items-center gap-3 border border-slate-100 shadow-xl animate-in slide-in-from-bottom-4 duration-300">
            <div className={`w-10 h-10 ${isPhone ? 'bg-blue-600' : 'bg-emerald-600'} rounded-full flex items-center justify-center shadow-lg`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div className="flex-1">
              <h4 className="text-slate-900 text-[10px] font-black uppercase tracking-wider mb-0.5">AI 实时助手</h4>
              <p className="text-slate-600 text-[11px] font-bold leading-tight">{aiTips[0]}</p>
            </div>
          </div>
        )}
      </div>

      {/* Conversations Container */}
      <div className="flex-1 overflow-y-auto p-6 mt-8 space-y-6 custom-scrollbar">
        {transcripts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-30 text-center px-10">
            {!isRecording ? (
              <div className="space-y-6">
                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                   <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
                     <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"></path><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"></path></svg>
                   </div>
                </div>
                <div>
                  <h3 className="text-white font-black text-lg mb-2">已就绪，等待现场会议开始</h3>
                  <p className="text-xs">点击下方按钮开始现场访谈录音，AI 将实时分析客户需求并提供辅助话术</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center gap-1">
                   {[1,2,3,4,5].map(i => <div key={i} className="w-1 bg-blue-500 rounded-full animate-bounce" style={{ height: `${Math.random()*24 + 10}px`, animationDelay: `${i*0.1}s` }}></div>)}
                </div>
                <p className="text-xs font-bold uppercase tracking-widest">正在侦听交谈内容...</p>
              </div>
            )}
          </div>
        )}
        {transcripts.map((t, i) => (
          <div key={i} className={`flex flex-col ${t.role === '我' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-4 duration-300`}>
            <span className="text-[10px] text-slate-600 font-black mb-1 uppercase tracking-widest">{t.role}</span>
            <div className={`max-w-[85%] p-4 rounded-[24px] text-sm leading-relaxed ${
              t.role === '我' ? 'bg-blue-600 text-white rounded-tr-none shadow-lg' : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
            }`}>
              {t.text}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Controls */}
      <div className="p-8 bg-slate-900/80 backdrop-blur-xl border-t border-white/5 flex flex-col gap-6 items-center">
        {!isRecording && !isPhone ? (
          <button 
            onClick={() => setIsRecording(true)}
            className="w-full bg-emerald-500 hover:bg-emerald-600 py-6 rounded-[28px] font-black text-lg flex items-center justify-center gap-4 transition-all active:scale-95 shadow-2xl shadow-emerald-900/40"
          >
            <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
            开始现场记录
          </button>
        ) : (
          <div className="w-full flex gap-4">
             <button 
              onClick={onEnd}
              className={`w-full ${isPhone ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'} px-10 py-5 rounded-[24px] font-black text-sm tracking-widest transition-all active:scale-95 shadow-2xl`}
            >
              结束{isPhone ? '通话' : '对话'}并生成复盘
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitActiveScreen;
