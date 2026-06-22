import React, { useState } from 'react';
import type { JournalEntry, StudyLog } from '../types';
import { Book, Calendar, Sparkles, X, ChevronRight } from 'lucide-react';

interface LibraryProps {
  entries: JournalEntry[];
  logs: StudyLog[];
}

export const Library: React.FC<LibraryProps> = ({ entries, logs }) => {
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'journals' | 'studies'>('journals');

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto p-4 pb-12 fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-semibold tracking-wider text-slate-100 flex items-center gap-2">
            <Book className="text-biolum-cyan drop-shadow-[0_0_8px_rgba(0,242,254,0.5)]" /> 書斎の記録 (深海の本棚)
          </h2>
          <p className="text-xs text-deepsea-300 mt-1">
            これまでにあなたが紡いだ言葉と、海に灯してきた光の軌跡。
          </p>
        </div>

        <div className="flex bg-deepsea-900 border border-deepsea-800 rounded-xl p-1 shadow-inner shadow-deepsea-950">
          <button
            onClick={() => setActiveSubTab('journals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeSubTab === 'journals' ? 'bg-biolum-cyan/15 text-biolum-cyan border border-biolum-cyan/30 shadow-[0_0_8px_rgba(0,242,254,0.2)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            日記の本棚 ({entries.length})
          </button>
          <button
            onClick={() => setActiveSubTab('studies')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeSubTab === 'studies' ? 'bg-biolum-cyan/15 text-biolum-cyan border border-biolum-cyan/30 shadow-[0_0_8px_rgba(0,242,254,0.2)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            光の軌跡 ({logs.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'journals' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {entries.length === 0 ? (
            <div className="col-span-full text-center py-24 glass-panel border-deepsea-700/50 flex flex-col items-center justify-center text-deepsea-400 text-sm">
              <Book className="mb-3 text-deepsea-500/50" size={40} />
              まだ深海の本棚に日記がありません。
            </div>
          ) : (
            [...entries].reverse().map((entry) => (
              <div
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className="glass-card p-6 flex flex-col justify-between min-h-[220px] cursor-pointer group"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-4">
                    <span className="text-[10px] text-biolum-cyan/70 font-semibold flex items-center gap-1">
                      <Calendar size={10} /> {entry.date}
                    </span>
                    <span className="px-2 py-0.5 bg-biolum-cyan/10 border border-biolum-cyan/20 text-[9px] text-biolum-cyan rounded-md shadow-[0_0_5px_rgba(0,242,254,0.1)]">
                      {entry.mood}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 line-clamp-2 serif-text leading-relaxed group-hover:text-biolum-cyan transition-colors">
                    {entry.title}
                  </h3>
                  <p className="text-xs text-deepsea-200 line-clamp-3 mt-3 leading-relaxed serif-text">
                    {entry.content.replace(/【.*?】/g, '')}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-5 pt-3 border-t border-deepsea-600/30 text-[10px] text-deepsea-400 font-medium">
                  <span>{entry.prompts.length > 0 ? '対話の記録あり' : '自由記述'}</span>
                  <span className="text-biolum-cyan/80 flex items-center gap-0.5 group-hover:text-biolum-cyan group-hover:translate-x-1 transition-all">
                    本を開く <ChevronRight size={10} />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="glass-panel p-6 border-deepsea-700/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-deepsea-600/50 text-biolum-cyan/70 font-semibold">
                  <th className="py-3 px-4">日付</th>
                  <th className="py-3 px-4">学習内容</th>
                  <th className="py-3 px-4">時間 (分)</th>
                  <th className="py-3 px-4">気づき / 一言メモ</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-16 text-deepsea-400">
                      まだ光の軌跡がありません。
                    </td>
                  </tr>
                ) : (
                  [...logs].reverse().map((log) => (
                    <tr key={log.id} className="border-b border-deepsea-800/80 hover:bg-deepsea-800/40 transition-colors">
                      <td className="py-3 px-4 text-deepsea-200">{log.date}</td>
                      <td className="py-3 px-4 text-slate-100 font-medium">{log.subject}</td>
                      <td className="py-3 px-4 text-biolum-cyan font-semibold drop-shadow-[0_0_2px_rgba(0,242,254,0.3)]">{log.duration} 分</td>
                      <td className="py-3 px-4 text-deepsea-300 italic">
                        {log.memo ? `“ ${log.memo} ”` : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 日記の閲覧モーダル */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-deepsea-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 fade-in">
          <div className="glass-panel border border-biolum-cyan/20 max-w-3xl w-full max-h-[85vh] flex flex-col shadow-[0_0_50px_rgba(0,242,254,0.1)] relative">
            <button
              onClick={() => setSelectedEntry(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-deepsea-800 transition-colors z-10"
            >
              <X size={18} />
            </button>

            <div className="p-6 border-b border-deepsea-700/80">
              <div className="flex items-center gap-3 text-xs text-biolum-cyan/70 mb-2">
                <span className="flex items-center gap-1"><Calendar size={12} /> {selectedEntry.date}</span>
                <span>•</span>
                <span className="px-2 py-0.5 bg-biolum-cyan/10 border border-biolum-cyan/20 text-biolum-cyan rounded">
                  気分: {selectedEntry.mood}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-100 serif-text">{selectedEntry.title}</h3>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-8 max-h-[60vh] custom-scrollbar">
              {selectedEntry.prompts.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h4 className="text-sm font-semibold text-biolum-cyan flex items-center gap-2">
                    <Sparkles size={14} /> 対話の足跡 (ヤドカリとの対話)
                  </h4>
                  <div className="flex flex-col gap-4 bg-deepsea-950/60 p-5 border border-deepsea-800 rounded-xl shadow-inner shadow-deepsea-900">
                    {selectedEntry.prompts.map((p, idx) => (
                      <div key={idx} className="flex flex-col gap-1.5 text-sm">
                        <div className="text-biolum-cyan/80 font-semibold">問: {p.question}</div>
                        <div className="text-deepsea-100 bg-deepsea-900/80 p-3 rounded-lg border border-deepsea-700/50 leading-relaxed">
                          {p.answer}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-semibold text-biolum-cyan">完成した日記</h4>
                <div className="p-6 bg-[#f0f7f9] text-deepsea-900 rounded-xl leading-[1.8] serif-text text-[15px] whitespace-pre-wrap border border-biolum-cyan/30 shadow-[inset_0_0_20px_rgba(79,172,254,0.1)]">
                  {selectedEntry.content}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-deepsea-700/80 flex justify-end">
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-5 py-2.5 bg-deepsea-800 hover:bg-deepsea-700 text-biolum-cyan text-xs font-semibold rounded-xl border border-deepsea-600 transition-colors shadow-[0_0_10px_rgba(0,242,254,0.1)]"
              >
                書斎の扉を閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
