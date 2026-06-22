import React, { useState } from 'react';
import type { StudyLog } from '../types';
import { Plus, BookOpen, Clock, Calendar, Sparkles } from 'lucide-react';

interface TrackerProps {
  logs: StudyLog[];
  onAddLog: (subject: string, duration: number, memo: string) => void;
}

export const Tracker: React.FC<TrackerProps> = ({ logs, onAddLog }) => {
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState<number>(30);
  const [memo, setMemo] = useState('');
  const [hoveredStar, setHoveredStar] = useState<{
    date: string;
    label: string;
    duration: number;
    logs: StudyLog[];
    x: number;
    y: number;
  } | null>(null);

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

  // 星座の各星の座標を定義 (viewBox: 0 0 1000 220)
  const starsData = recentDays.map((day, index) => {
    const totalDuration = getTotalDurationForDate(day.date);
    const hasStudy = totalDuration > 0;
    const dateLogs = getLogsForDate(day.date);

    // X座標: 50 から 950 まで均等に配置
    const x = 50 + (index / 13) * 900;
    // Y座標: 学習時間に応じて 40 (学習量大) から 180 (学習量小/なし) まで変動
    const y = hasStudy 
      ? 180 - Math.min((totalDuration / 120) * 120, 140)
      : 180;

    return {
      day,
      x,
      y,
      hasStudy,
      totalDuration,
      dateLogs,
    };
  });

  // 星を繋ぐ線のパスデータを生成
  const linePath = starsData
    .filter((star) => star.hasStudy)
    .map((star, idx) => `${idx === 0 ? 'M' : 'L'} ${star.x} ${star.y}`)
    .join(' ');

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto p-4 pb-12 fade-in">
      {/* ヘッダー */}
      <div>
        <h2 className="text-2xl font-semibold tracking-wider text-slate-100 flex items-center gap-2">
          <Sparkles className="text-biolum-cyan animate-glow" /> 海の学びの軌跡 (学習トラッカー)
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          日々の学びを記録し、深海にあなただけの光の軌跡を描きましょう。
        </p>
      </div>

      {/* 星空の星座ビジュアル */}
      <div className="glass-panel p-6 relative overflow-visible min-h-[340px] flex flex-col justify-between border-deepsea-700/40">
        
        <div className="relative z-10 flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-300">深海の光跡 (直近14日間の軌跡)</h3>
            <p className="text-[10px] text-slate-500">光にカーソルを合わせると、学習の詳細が表示されます。</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-biolum-cyan font-semibold bg-biolum-cyan/5 border border-biolum-cyan/20 px-3 py-1.5 rounded-xl shadow-[0_0_10px_rgba(0,242,254,0.1)]">
            <Sparkles size={14} className="animate-spin-slow" />
            <span>合計学習時間: {logs.reduce((acc, curr) => acc + curr.duration, 0)} 分</span>
          </div>
        </div>

        {/* 星空のSVGキャンバス */}
        <div className="relative w-full aspect-[1000/230] bg-deepsea-950/40 border border-deepsea-800 rounded-xl overflow-visible shadow-inner">
          <svg
            viewBox="0 0 1000 230"
            className="w-full h-full overflow-visible"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* グラデーション定義 */}
            <defs>
              <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(0, 242, 254, 1)" />
                <stop offset="30%" stopColor="rgba(0, 242, 254, 0.5)" />
                <stop offset="100%" stopColor="rgba(0, 242, 254, 0)" />
              </radialGradient>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(79, 172, 254, 0.2)" />
                <stop offset="50%" stopColor="rgba(0, 242, 254, 0.8)" />
                <stop offset="100%" stopColor="rgba(79, 172, 254, 0.2)" />
              </linearGradient>
            </defs>

            {/* ガイド横線 */}
            <line x1="30" y1="180" x2="970" y2="180" stroke="rgba(0,242,254,0.05)" strokeWidth="1" />
            <line x1="30" y1="110" x2="970" y2="110" stroke="rgba(0,242,254,0.05)" strokeWidth="1" strokeDasharray="5 5" />
            <line x1="30" y1="40" x2="970" y2="40" stroke="rgba(0,242,254,0.05)" strokeWidth="1" strokeDasharray="5 5" />

            {/* 星座のコネクションライン */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="url(#lineGrad)"
                strokeWidth="2"
                strokeDasharray="6 4"
                className="transition-all duration-700"
                style={{ filter: 'drop-shadow(0 0 4px rgba(0,242,254,0.5))' }}
              />
            )}

            {/* 各日の星とインタラクション領域 */}
            {starsData.map((star) => {
              const starSize = star.hasStudy ? Math.min(5 + (star.totalDuration / 12), 15) : 3;
              
              return (
                <g
                  key={star.day.date}
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => {
                    if (star.hasStudy) {
                      setHoveredStar({
                        date: star.day.date,
                        label: star.day.label,
                        duration: star.totalDuration,
                        logs: star.dateLogs,
                        x: star.x,
                        y: star.y,
                      });
                    }
                  }}
                  onMouseLeave={() => setHoveredStar(null)}
                >
                  {/* 未学習日の極小の点 */}
                  {!star.hasStudy && (
                    <circle cx={star.x} cy={star.y} r={starSize} fill="#113554" />
                  )}

                  {/* 学習した日の光り輝く星 */}
                  {star.hasStudy && (
                    <>
                      {/* 外光ハロー */}
                      <circle cx={star.x} cy={star.y} r={starSize * 2.8} fill="url(#starGlow)" opacity="0.8" className="animate-pulse" />
                      {/* 中心点 */}
                      <circle cx={star.x} cy={star.y} r={starSize} fill="#00f2fe" style={{ filter: 'drop-shadow(0 0 5px #00f2fe)' }} />
                      <circle cx={star.x} cy={star.y} r={starSize * 0.4} fill="#ffffff" />
                    </>
                  )}

                  {/* マウスホバー用の広い判定エリア */}
                  <circle cx={star.x} cy={star.y} r="20" fill="transparent" />

                  {/* 日付ラベル (下部) */}
                  <text
                    x={star.x}
                    y="215"
                    textAnchor="middle"
                    fill={star.hasStudy ? '#84c6da' : '#2a6487'}
                    fontSize="10"
                    fontWeight={star.hasStudy ? '600' : '400'}
                    className="select-none transition-colors"
                  >
                    {star.day.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* ホバー時のツールチップ */}
          {hoveredStar && (
            <div
              className="absolute z-30 bg-deepsea-900/95 border border-biolum-cyan/40 text-slate-100 p-4 rounded-xl shadow-[0_0_20px_rgba(0,242,254,0.2)] transition-all duration-200 pointer-events-none backdrop-blur-md"
              style={{
                left: `${(hoveredStar.x / 1000) * 100}%`,
                top: `${(hoveredStar.y / 230) * 100 - 10}%`,
                transform: 'translate(-50%, -105%)',
                minWidth: '200px',
              }}
            >
              <div className="flex justify-between items-center border-b border-deepsea-700 pb-1.5 mb-2">
                <span className="font-semibold text-xs text-biolum-cyan drop-shadow-[0_0_2px_rgba(0,242,254,0.8)]">{hoveredStar.label}</span>
                <span className="text-[10px] text-slate-300 bg-deepsea-800 px-2 py-0.5 rounded-md font-semibold border border-deepsea-600">
                  {hoveredStar.duration} 分
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                {hoveredStar.logs.map((l) => (
                  <div key={l.id} className="text-xs">
                    <div className="font-medium text-slate-200">{l.subject}</div>
                    {l.memo && <div className="text-[10px] text-biolum-cyan/70 italic mt-0.5">“{l.memo}”</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 記録フォーム & 履歴一覧 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 学習の記録フォーム */}
        <div className="lg:col-span-4 glass-panel p-6 flex flex-col gap-4 border-deepsea-700/80">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Plus size={16} className="text-biolum-cyan" /> 深海に光を灯す
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] text-biolum-cyan/70 mb-1">学習内容</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="例: 英語のリーディング, プログラミング..."
                className="w-full bg-deepsea-950/80 border border-deepsea-800 focus:border-biolum-cyan/60 focus:ring-1 focus:ring-biolum-cyan/30 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none transition-all shadow-inner shadow-deepsea-900"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] text-biolum-cyan/70 mb-1">学習時間 (分): <span className="text-biolum-cyan font-semibold">{duration}分</span></label>
              <input
                type="range"
                min="5"
                max="180"
                step="5"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full accent-biolum-cyan bg-deepsea-800 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-deepsea-400 mt-1">
                <span>5分</span>
                <span>60分</span>
                <span>120分</span>
                <span>180分</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-biolum-cyan/70 mb-1">一言メモ / 気づき (任意)</label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="何を学んだか、何を感じたか..."
                rows={3}
                className="w-full bg-deepsea-950/80 border border-deepsea-800 focus:border-biolum-cyan/60 focus:ring-1 focus:ring-biolum-cyan/30 rounded-xl px-4 py-2 text-sm text-slate-100 outline-none resize-none transition-all shadow-inner shadow-deepsea-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-biolum-cyan to-biolum-blue text-deepsea-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(0,242,254,0.4)] active:scale-95 transition-all duration-300"
            >
              <Sparkles size={14} />
              <span>光を放つ</span>
            </button>
          </form>
        </div>

        {/* 最近の学習ログ一覧 */}
        <div className="lg:col-span-8 glass-panel p-6 flex flex-col gap-4 border-deepsea-700/80">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <BookOpen size={16} className="text-biolum-cyan" /> 軌跡の記録 (最近)
          </h3>
          
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[380px] pr-2">
            {logs.length === 0 ? (
              <div className="text-center py-16 text-deepsea-400 text-xs flex flex-col items-center">
                <Sparkles size={24} className="mb-3 opacity-30" />
                まだ学習の記録がありません。<br />最初の光を灯してみましょう。
              </div>
            ) : (
              [...logs].reverse().map((log) => (
                <div key={log.id} className="p-4 bg-deepsea-900/50 border border-deepsea-800/80 rounded-xl flex items-start justify-between hover:border-biolum-cyan/30 hover:bg-deepsea-800/60 transition-all duration-300 group">
                  <div className="flex flex-col gap-1.5">
                    <div className="text-sm font-medium text-slate-200 group-hover:text-biolum-cyan transition-colors">{log.subject}</div>
                    {log.memo && <div className="text-xs text-deepsea-300 italic">“ {log.memo} ”</div>}
                    <div className="flex items-center gap-4 text-[10px] text-deepsea-400 mt-1">
                      <span className="flex items-center gap-1"><Calendar size={10} /> {log.date}</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {log.duration} 分</span>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-biolum-cyan bg-biolum-cyan/10 border border-biolum-cyan/20 px-3 py-1 rounded-lg shadow-[0_0_5px_rgba(0,242,254,0.1)]">
                    +{log.duration} 分
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
