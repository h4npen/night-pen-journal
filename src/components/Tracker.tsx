import React, { useState } from 'react';
import { StudyLog } from '../types';
import { Plus, BookOpen, Clock, Calendar, Sparkles } from 'lucide-react';

interface TrackerProps {
  logs: StudyLog[];
  onAddLog: (subject: string, duration: number, memo: string) => void;
}

export const Tracker: React.FC<TrackerProps> = ({ logs, onAddLog }) => {
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState<number>(30);
  const [memo, setMemo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;
    onAddLog(subject, duration, memo);
    setSubject('');
    setMemo('');
  };

  // 直近14日間の日付配列を作成
  const getRecentDays = () => {
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      days.push({
        date: dateString,
        label: `${d.getMonth() + 1}/${d.getDate()}`,
        dayOfWeek: d.getDay(),
      });
    }
    return days;
  };

  const recentDays = getRecentDays();

  // 特定の日の学習ログを取得
  const getLogsForDate = (dateStr: string) => {
    return logs.filter((log) => log.date === dateStr);
  };

  // 特定の日の総学習時間
  const getTotalDurationForDate = (dateStr: string) => {
    return getLogsForDate(dateStr).reduce((acc, curr) => acc + curr.duration, 0);
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto p-4 pb-12 fade-in">
      {/* ヘッダー */}
      <div>
        <h2 className="text-2xl font-semibold tracking-wider text-slate-100 flex items-center gap-2">
          <Sparkles className="text-amber-400" /> 学びの庭 (学習トラッカー)
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          日々の学びを記録し、夜空にあなただけの星座を描きましょう。
        </p>
      </div>

      {/* 星空の星座ビジュアル (Constellation Visualization) */}
      <div className="glass-panel p-6 relative overflow-hidden min-h-[300px] flex flex-col justify-between">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent pointer-events-none" />
        
        {/* 背景の星たち */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDuration: '4s' }} />
          <div className="absolute top-1/3 left-2/3 w-1.5 h-1.5 bg-yellow-100 rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="absolute top-2/3 left-1/5 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDuration: '5s' }} />
        </div>

        <div className="relative z-10 flex justify-between items-center mb-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-300">夜空の星座 (直近14日間の軌跡)</h3>
            <p className="text-[10px] text-slate-500">学習時間が多い日ほど、星は大きく光り輝きます。</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
            <Sparkles size={14} />
            <span>合計学習時間: {logs.reduce((acc, curr) => acc + curr.duration, 0)} 分</span>
          </div>
        </div>

        {/* 星空のSVGキャンバス */}
        <div className="relative w-full h-40 flex items-center justify-between px-4 bg-slate-950/40 border border-slate-800/60 rounded-xl">
          {/* 星を繋ぐ線 (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <path
              d={recentDays
                .map((day, index) => {
                  const hasStudy = getTotalDurationForDate(day.date) > 0;
                  if (!hasStudy) return '';
                  const x = `${(index / (recentDays.length - 1)) * 90 + 5}%`;
                  // 学習時間に応じてY座標を変動（高いほど上へ）
                  const studyTime = getTotalDurationForDate(day.date);
                  const y = `${100 - Math.min(studyTime / 120 * 60 + 20, 80)}%`;
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                })
                .filter(Boolean)
                .join(' ')}
              fill="none"
              stroke="rgba(212, 175, 55, 0.4)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              className="transition-all duration-500"
            />
          </svg>

          {/* 各日の星 */}
          {recentDays.map((day, index) => {
            const dateLogs = getLogsForDate(day.date);
            const totalDuration = getTotalDurationForDate(day.date);
            const hasStudy = totalDuration > 0;

            // 星の大きさと輝き
            const starSize = hasStudy ? Math.min(10 + (totalDuration / 10), 24) : 4;
            const starColor = hasStudy ? 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]' : 'bg-slate-700';
            
            // Y軸の位置調整
            const yOffset = hasStudy ? Math.min(totalDuration / 120 * 60 + 20, 80) : 50;

            return (
              <div
                key={day.date}
                className="flex flex-col items-center justify-end h-full relative group transition-all duration-300"
                style={{ width: `${100 / recentDays.length}%` }}
              >
                {/* 星の球体 */}
                <div
                  className={`rounded-full absolute transition-all duration-500 ${starColor}`}
                  style={{
                    bottom: `${yOffset}%`,
                    width: `${starSize}px`,
                    height: `${starSize}px`,
                    transform: 'translateY(50%)',
                  }}
                />

                {/* ホバー時のツールチップ */}
                {hasStudy && (
                  <div className="absolute bottom-[85%] left-1/2 -translate-x-1/2 bg-slate-900 border border-amber-500/30 text-[10px] text-slate-200 px-2 py-1 rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20">
                    <div className="font-semibold text-amber-400">{day.label}</div>
                    <div>学習: {totalDuration}分</div>
                    {dateLogs.map(l => (
                      <div key={l.id} className="text-slate-400 truncate max-w-[120px]">- {l.subject}</div>
                    ))}
                  </div>
                )}

                {/* 日付ラベル */}
                <span className="text-[10px] text-slate-500 mb-2 font-medium z-10">{day.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 学習の記録フォーム */}
        <div className="md:col-span-1 glass-panel p-6 flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Plus size={16} className="text-amber-400" /> 今日の学びを蒔く
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">学習内容</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="例: 英語のリーディング, 基本情報技術者..."
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 rounded-xl px-4 py-2 text-sm text-slate-100 outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">学習時間 (分): {duration}分</label>
              <input
                type="range"
                min="5"
                max="180"
                step="5"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 h-1 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>5分</span>
                <span>60分</span>
                <span>120分</span>
                <span>180分</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">一言メモ / 気づき (任意)</label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="何を学んだか、何を感じたか..."
                rows={3}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 rounded-xl px-4 py-2 text-sm text-slate-100 outline-none resize-none transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-amber-500/20 active:scale-98 transition-all duration-200"
            >
              <Sparkles size={14} />
              <span>庭に星を降らせる</span>
            </button>
          </form>
        </div>

        {/* 最近の学習ログ一覧 */}
        <div className="md:col-span-2 glass-panel p-6 flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <BookOpen size={16} className="text-amber-400" /> 学びの記録 (最近)
          </h3>
          
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[350px] pr-2">
            {logs.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                まだ学習の記録がありません。<br />最初の学びを記録してみましょう。
              </div>
            ) : (
              [...logs].reverse().map((log) => (
                <div key={log.id} className="p-4 bg-slate-900/30 border border-slate-800/80 rounded-xl flex items-start justify-between hover:border-slate-700/80 transition-colors">
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-medium text-slate-200">{log.subject}</div>
                    {log.memo && <div className="text-xs text-slate-400 italic">“ {log.memo} ”</div>}
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1">
                      <span className="flex items-center gap-1"><Calendar size={10} /> {log.date}</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {log.duration} 分</span>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-amber-400/90 bg-amber-500/5 border border-amber-500/10 px-2.5 py-1 rounded-lg">
                    +{log.duration} min
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
