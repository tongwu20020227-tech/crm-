
import React, { useState, useEffect, useRef } from 'react';
import { ScheduledVisit } from '../types';

interface PostVisitReviewProps {
  customerName: string;
  isExisting: boolean;
  onClose: (action?: 'follow-up' | 'completed') => void;
  onScheduleNext?: (visit: ScheduledVisit) => void;
}

interface TaskItem {
  id: number;
  text: string;
  priority: string;
  fileName?: string;
  fileUrl?: string;
  fileType?: 'image' | 'file' | 'none';
  isCustom: boolean;
}

const PostVisitReview: React.FC<PostVisitReviewProps> = ({ customerName, isExisting, onClose, onScheduleNext }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSharing, setIsSharing] = useState(false);
  const [planCreated, setPlanCreated] = useState(false);
  
  // 恢复：下次拜访的详细状态
  const [nextVisitTime, setNextVisitTime] = useState('2025-12-08T10:00');
  const [nextVisitGoal, setNextVisitGoal] = useState('京东溯源防伪系统演示，仓网规划详细方案讲解');

  // 任务状态：全面复原并支持附件
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: 1, text: '发送智能物流网络解决方案详细资料', priority: '高优先级', fileName: '方案详细资料.pdf', isCustom: false, fileType: 'file' },
    { id: 2, text: '安排京东溯源防伪系统演示', priority: '高优先级', fileName: 'Demo预约链接', isCustom: false, fileType: 'none' },
    { id: 3, text: '提供仓网规划 ROI 测算报告', priority: '高优先级', fileName: 'ROI分析报告.xlsx', isCustom: false, fileType: 'file' },
  ]);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [newTaskInput, setnewTaskInput] = useState('');
  const [attachedFile, setAttachedFile] = useState<{name: string, url: string, type: 'image' | 'file'} | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);

  const audioSrc = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; 
  
  const resonantClips = [
    { id: 1, timeLabel: "00:45", seconds: 45, text: "“可以啊，这个BC同仓确实省心”" },
    { id: 2, timeLabel: "02:15", seconds: 135, text: "“可以啊，成本能降15%就有的聊”" },
  ];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) audioRef.current.playbackRate = rate;
  };

  const jumpToTime = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTask = (id: number) => {
    setSelectedTasks(prev => 
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  // 本地资源选择逻辑
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAttachedFile({ name: file.name, url, type });
      if (!newTaskInput.trim()) {
        setnewTaskInput(`交付: ${file.name}`);
      }
    }
  };

  const handleAddCustomTask = () => {
    if (!newTaskInput.trim() && !attachedFile) return;
    
    const newId = Date.now();
    const newTask: TaskItem = {
      id: newId,
      text: newTaskInput || (attachedFile ? attachedFile.name : '未命名行动项'),
      priority: '自定义',
      fileName: attachedFile?.name,
      fileUrl: attachedFile?.url,
      fileType: attachedFile?.type || 'none',
      isCustom: true
    };

    setTasks(prev => [...prev, newTask]);
    setSelectedTasks(prev => [...prev, newId]);
    setnewTaskInput('');
    setAttachedFile(null);
  };

  const handleCreatePlan = () => {
    if (onScheduleNext) {
      const newVisit: ScheduledVisit = {
        id: 'review_next_' + Math.random().toString(36).substr(2, 9),
        customerId: 'temp_id',
        customerName: customerName,
        time: nextVisitTime.replace('T', ' '),
        contactName: '张总监',
        contactPhone: '13812340001',
        type: 'in-person',
        status: 'planned'
      };
      onScheduleNext(newVisit);
      setPlanCreated(true);
      setTimeout(() => setPlanCreated(false), 3000);
      alert(`已成功创建拜访计划：\n目标：${nextVisitGoal}\n时间：${nextVisitTime}`);
    }
  };

  const handleFinishFollowUp = () => {
    setIsSharing(true);
    setTimeout(() => {
      onClose('completed');
    }, 1200);
  };

  const currentProgress = duration ? (currentTime / duration) * 100 : 0;

  const coachMetrics = [
    { label: '倾听深度', score: 85, icon: '👂' },
    { label: '产品呈现', score: 72, icon: '💎' },
    { label: '异议化解', score: 90, icon: '🛡️' },
    { label: '客情共鸣', score: 95, icon: '❤️' },
    { label: '商机捕捉', score: 65, icon: '🎯' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 flex flex-col overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-10 duration-500 pb-32">
      <audio ref={audioRef} src={audioSrc} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} />
      
      {/* 隐藏的本地资源选择器 */}
      <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'file')} />
      <input type="file" ref={imgInputRef} accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'image')} />

      {/* 顶部汇总卡片 */}
      <section className="bg-gradient-to-b from-blue-600 via-indigo-500 to-slate-50 pt-4 pb-8 px-5 relative">
        <div className="flex items-center justify-between mb-6 text-white">
          <button onClick={() => onClose('follow-up')} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <h1 className="text-xl font-black tracking-tight">拜访复盘</h1>
          <div className="w-10"></div>
        </div>

        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-[32px] p-6 text-white shadow-2xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-black">{customerName}</h2>
              <p className="text-[11px] font-bold opacity-80 mt-1">2025年12月4日 14:00-14:50</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="bg-emerald-400 text-white text-[10px] font-black px-2 py-0.5 rounded-lg">拜访成功</span>
              <span className="text-[10px] font-bold">兴趣度: 92%</span>
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-white/20">
            <div className="text-center flex-1 border-r border-white/10">
              <div className="text-xl font-black">50'</div>
              <div className="text-[9px] font-bold opacity-70 mt-1 uppercase">时长</div>
            </div>
            <div className="text-center flex-1 border-r border-white/10">
              <div className="text-xl font-black">4</div>
              <div className="text-[9px] font-bold opacity-70 mt-1 uppercase">关键词</div>
            </div>
            <div className="text-center flex-1">
              <div className="text-xl font-black">{tasks.length}</div>
              <div className="text-[9px] font-bold opacity-70 mt-1 uppercase">任务项</div>
            </div>
          </div>
        </div>
      </section>

      <div className="px-5 -mt-4 space-y-5">
        {/* AI 智能复盘分析 */}
        <section className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
               <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
            </div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">AI 智能复盘分析</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
             <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] text-slate-400 font-black uppercase mb-1">我方说话时长</p>
                <p className="text-sm font-black text-slate-800">18分 22秒</p>
             </div>
             <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] text-slate-400 font-black uppercase mb-1">客户说话时长</p>
                <p className="text-sm font-black text-slate-800">31分 38秒</p>
             </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-bold italic">
            "张总监对我们提出的<span className="text-blue-600 underline">智能云仓配</span>表现出极大兴趣。"
          </p>
        </section>

        {/* AI 教练：个人诊疗 - 仅针对老客户显示 */}
        {isExisting && (
          <section className="bg-[#f0f9ff] rounded-[32px] p-6 border border-blue-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                 <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-800 tracking-tight">AI 销售教练：个人诊疗</h2>
                <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-0.5">面向老客户关系的深度评估</p>
              </div>
            </div>
            <div className="space-y-4">
              {coachMetrics.map((m, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-bold">
                    <span className="text-slate-600 flex items-center gap-2"><span>{m.icon}</span> {m.label}</span>
                    <span className="text-blue-600 font-black italic">{m.score}%</span>
                  </div>
                  <div className="h-1.5 bg-white rounded-full overflow-hidden p-[1px]">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${m.score}%` }}></div>
                  </div>
                </div>
              ))}
              {/* 新增：针对销售的具体行动指引 */}
              <div className="mt-4 p-4 bg-white/60 rounded-2xl border border-blue-50">
                 <p className="text-[10px] text-blue-400 font-black uppercase mb-1">后续行动建议</p>
                 <p className="text-[11px] font-bold text-slate-700 leading-relaxed italic">
                   "针对本次拜访评估，你的<span className="text-blue-600">商机捕捉</span>项分值较低。接下来你要做的是：在后续跟进计划中重点锁定张总关注的‘成本ROI’，利用本次访谈中的<span className="text-emerald-500">高共鸣度切入点</span>，快速提交定制化方案并推进签约流程。"
                 </p>
              </div>
            </div>
          </section>
        )}

        {/* 录音回放区与共鸣点 */}
        <section className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-5">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                <h3 className="text-sm font-black text-slate-800 tracking-tight">拜访现场录音</h3>
              </div>
              <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
                 {[1.0, 1.5, 2.0].map(rate => (
                    <button key={rate} onClick={() => handleSpeedChange(rate)} className={`text-[9px] font-black px-2 py-1 rounded-lg transition-all ${playbackRate === rate ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>x{rate}</button>
                 ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
               <button onClick={togglePlay} className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-95">
                  {isPlaying ? <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg> : <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>}
               </button>
               <div className="flex-1 space-y-1">
                 <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration || 3018)}</span>
                 </div>
                 <div className="h-1.5 bg-slate-100 rounded-full relative overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-100" style={{ width: `${currentProgress || 0}%` }}></div>
                 </div>
               </div>
            </div>
            <div className="space-y-3">
               {resonantClips.map(clip => (
                 <div key={clip.id} onClick={() => jumpToTime(clip.seconds)} className="flex items-center gap-3 p-4 bg-slate-50/80 rounded-[24px] border border-slate-100 cursor-pointer hover:bg-blue-50 transition-all">
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg></div>
                    <div className="flex-1">
                      <p className="text-[11px] font-bold text-slate-600 italic leading-snug">“{clip.text}”</p>
                      <span className="text-[9px] text-slate-400 font-black tracking-widest uppercase mt-1 block">{clip.timeLabel} 处产生共鸣</span>
                    </div>
                 </div>
               ))}
            </div>
        </section>

        {/* 客户关注点 */}
        <section className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-4">
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-5 bg-amber-500 rounded-full"></div>
             <h2 className="text-base font-black text-slate-800 tracking-tight">客户关注核心点</h2>
           </div>
           <div className="flex flex-wrap gap-2">
             {["物流成本控制", "防伪技术可靠性", "实施周期安排", "售后服务集成"].map((point, idx) => (
               <span key={idx} className="bg-amber-50 text-amber-600 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-amber-100">{point}</span>
             ))}
           </div>
        </section>

        {/* 后续行动计划：复原并强化本地附件功能 */}
        <section className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-6">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-5 bg-indigo-600 rounded-full"></div>
               <h2 className="text-base font-black text-slate-800 tracking-tight">后续行动计划</h2>
             </div>
             <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-bold text-slate-400 uppercase">选中: {selectedTasks.length}</span>
           </div>
          
          <div className="space-y-4">
             {tasks.map(task => (
               <div key={task.id} className="flex items-start gap-4 group">
                  <div 
                    onClick={() => toggleTask(task.id)}
                    className={`w-7 h-7 mt-1 rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all ${selectedTasks.includes(task.id) ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-100' : 'border-slate-200 hover:border-blue-200'}`}
                  >
                    {selectedTasks.includes(task.id) && <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>}
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs font-black transition-colors ${selectedTasks.includes(task.id) ? 'text-blue-600' : 'text-slate-700'}`}>{task.text}</p>
                    
                    {/* 附件微缩展示 */}
                    {task.fileName && (
                      <div className="mt-2 flex items-center gap-3 bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
                         {task.fileType === 'image' && task.fileUrl ? (
                           <img src={task.fileUrl} alt="preview" className="w-12 h-12 rounded-xl object-cover border border-white shadow-sm" />
                         ) : (
                           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">
                             {task.fileType === 'file' ? '📄' : '🔗'}
                           </div>
                         )}
                         <div className="flex-1 overflow-hidden">
                           <p className="text-[10px] text-slate-500 font-bold truncate max-w-[140px]">{task.fileName}</p>
                           <button className="text-[9px] text-blue-500 font-black uppercase mt-0.5 hover:underline">点击查看附件</button>
                         </div>
                      </div>
                    )}
                  </div>
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase mt-1 ${task.isCustom ? 'bg-indigo-50 text-indigo-500 border border-indigo-100' : 'bg-amber-100 text-amber-600'}`}>
                    {task.isCustom ? '自定义' : '高优'}
                  </span>
               </div>
             ))}
          </div>

          {/* 智能附件添加输入框 */}
          <div className="pt-4 border-t border-slate-50">
             {attachedFile && (
               <div className="mb-3 p-3 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-between animate-in zoom-in duration-200">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-lg">{attachedFile.type === 'image' ? '🖼️' : '📎'}</div>
                   <span className="text-[10px] font-black text-blue-600 truncate max-w-[180px]">{attachedFile.name}</span>
                 </div>
                 <button onClick={() => setAttachedFile(null)} className="text-blue-300 hover:text-blue-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                 </button>
               </div>
             )}
             
             <div className="flex gap-2">
                <div className="flex gap-1">
                   <button 
                     onClick={() => imgInputRef.current?.click()}
                     className="w-11 h-11 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center border border-slate-100 active:scale-95 transition-all"
                   >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                   </button>
                   <button 
                     onClick={() => fileInputRef.current?.click()}
                     className="w-11 h-11 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center border border-slate-100 active:scale-95 transition-all"
                   >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                   </button>
                </div>
                <input 
                   type="text" 
                   placeholder="输入任务或点击左侧添加附件..."
                   value={newTaskInput}
                   onChange={(e) => setnewTaskInput(e.target.value)}
                   onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTask()}
                   className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:ring-2 ring-indigo-500 transition-all placeholder:text-slate-300"
                />
                <button 
                   onClick={handleAddCustomTask}
                   className="w-11 h-11 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all"
                >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                </button>
             </div>
          </div>
        </section>

        {/* 下次拜访计划：完全复原时间与目标自定义 */}
        <section className="bg-[#f8f6ff] rounded-[32px] p-6 border border-indigo-100 shadow-sm space-y-5">
           <div className="flex items-center gap-3">
              <div className="w-1.5 h-5 bg-purple-500 rounded-full"></div>
              <h2 className="text-base font-black text-slate-800 tracking-tight">下次拜访计划</h2>
           </div>
           <div className="space-y-4">
              <div className="space-y-2">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">计划时间</label>
                 <input 
                    type="datetime-local" 
                    value={nextVisitTime}
                    onChange={(e) => setNextVisitTime(e.target.value)}
                    className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-slate-700 shadow-sm outline-none"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">核心目标</label>
                 <textarea 
                    value={nextVisitGoal}
                    onChange={(e) => setNextVisitGoal(e.target.value)}
                    className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 px-5 text-xs font-bold text-slate-600 shadow-sm outline-none min-h-[80px] resize-none"
                    placeholder="请输入下次拜访的核心目标..."
                 />
              </div>
              <button onClick={handleCreatePlan} className={`w-full py-4 text-white font-black text-sm rounded-[24px] shadow-lg active:scale-[0.98] transition-all ${planCreated ? 'bg-emerald-500 shadow-emerald-100' : 'bg-gradient-to-r from-blue-500 to-cyan-500'}`}>
                 {planCreated ? '✅ 已同步到计划中心' : '创建拜访计划'}
              </button>
           </div>
        </section>
      </div>

      {/* 底部固定操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-2xl border-t border-slate-100 z-[60] max-w-md mx-auto flex gap-4 shadow-lg">
        <button onClick={() => onClose('follow-up')} className="flex-1 py-5 rounded-[28px] font-black text-sm bg-slate-100 text-slate-600 active:scale-95 transition-all">稍后处理</button>
        <button 
          onClick={handleFinishFollowUp}
          className={`flex-[2] py-5 rounded-[28px] font-black text-sm flex items-center justify-center gap-3 transition-all ${selectedTasks.length > 0 ? 'bg-blue-600 text-white shadow-2xl active:scale-95 shadow-blue-200' : 'bg-blue-200 text-white cursor-not-allowed opacity-60'}`}
          disabled={selectedTasks.length === 0}
        >
          {isSharing ? '正在发送...' : `发送给客户 (${selectedTasks.length})`}
        </button>
      </div>
    </div>
  );
};

export default PostVisitReview;
