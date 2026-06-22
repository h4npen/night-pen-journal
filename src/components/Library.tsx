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
    <div className="flex flex-col gap-8 max-w-5xl mx-auto p-4 pb-12 fade-in">
      {/* ヘッダー */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-semibold tracking-wider text-slate-100 flex items-center gap-2">
            <Book className="text-amber-400" /> 書斎の記録 (本棚)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            これまでにあなたが紡いだ言葉と、積み重ねてきた学びの軌跡。
          </p>
        </div>

        {/* サブタブ */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
          <button
            onClick={() => setActiveSubTab('journals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeSubTab === 'journals' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            日記の本棚 ({entries.length})
          </button>
          <button
            onClick={() => setActiveSubTab('studies')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeSubTab === 'studies' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            学びの履歴 ({logs.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'journals' ? (
        /* 日記の本棚 */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {entries.length === 0 ? (
            <div className="col-span-full text-center py-20 glass-panel flex flex-col items-center justify-center text-slate-500 text-xs">
              <Book className="mb-2 text-slate-650" size={32} />
              まだ本棚に日記がありません。最初のペンをとってみましょう。
            </div>
          ) : (
            [...entries].reverse().map((entry) => (
              <div
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className="glass-card p-6 flex flex-col justify-between min-h-[200px] cursor-pointer hover:scale-102"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                      <Calendar size={10} /> {entry.date}
                    </span>
                    <span className="px-2 py-0.5 bg-amber-500/5 border border-amber-500/10 text-[9px] text-amber-400 rounded-md">
                      {entry.mood}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-200 line-clamp-2 serif-text leading-relaxed">
                    {entry.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 mt-3 leading-relaxed serif-text">
                    {entry.content.replace(/【.*?】/g, '')}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-800/40 text-[10px] text-slate-500 font-medium">
                  <span>{entry.prompts.length > 0 ? '対話の記録あり' : '自由記述'}</span>
                  <span className="text-amber-400/80 flex items-center gap-0.5 hover:text-amber-300">
                    本を開く <ChevronRight size={10} />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* 学びの全履歴 */
        <div className="glass-panel p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-850 text-slate-400 font-semibold">
                  <th className="py-3 px-4">日付</th>
                  <th className="py-3 px-4">学習内容</th>
                  <th className="py-3 px-4">時間 (分)</th>
                  <th className="py-3 px-4">気づき / 一言メモ</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-slate-500">
                      まだ学習の履歴がありません。
                    </td>
                  </tr>
                ) : (
                  [...logs].reverse().map((log) => (
                    <tr key={log.id} className="border-b border-slate-900 hover:bg-white/1 flex-row transition-colors">
                      <td className="py-3 px-4 text-slate-450">{log.date}</td>
                      <td className="py-3 px-4 text-slate-200 font-medium">{log.subject}</td>
                      <td className="py-3 px-4 text-amber-400 font-semibold">{log.duration} 分</td>
                      <td className="py-3 px-4 text-slate-400 italic">
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
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 fade-in">
          <div className="glass-panel border border-slate-700/50 max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl relative">
            <button
              onClick={() => setSelectedEntry(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-900 transition-colors"
            >
              <X size={18} />
            </button>

            {/* モーダルヘッダー */}
            <div className="p-6 border-b border-slate-800/80">
              <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                <span className="flex items-center gap-1"><Calendar size={12} /> {selectedEntry.date}</span>
                <span>•</span>
                <span className="px-2 py-0.5 bg-amber-500/5 border border-amber-500/10 text-amber-400 rounded">
                  気分: {selectedEntry.mood}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-100 serif-text">{selectedEntry.title}</h3>
            </div>

            {/* モーダルコンテンツ */}
            <div className="p-6 overflow-y-auto flex flex-col gap-6 max-h-[50vh]">
              {selectedEntry.prompts.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                    <Sparkles size={12} /> 対話の足跡 (ヤドカリとの対話)
                  </h4>
                  <div className="flex flex-col gap-3.5 bg-slate-950/40 p-4 border border-slate-850 rounded-xl">
                    {selectedEntry.prompts.map((p, idx) => (
                      <div key={idx} className="flex flex-col gap-1 text-xs">
                        <div className="text-amber-300/80 font-medium">問: {p.question}</div>
                        <div className="text-slate-350 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/40 leading-relaxed">
                          {p.answer}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-semibold text-slate-400">完成した日記</h4>
                <div className="p-5 bg-[#faf8f5] text-slate-850 rounded-xl leading-relaxed serif-text text-sm whitespace-pre-wrap border border-amber-600/10">
                  {selectedEntry.content}
                </div>
              </div>
            </div>

            {/* モーダルフッター */}
            <div className="p-4 border-t border-slate-800/80 flex justify-end">
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition-colors"
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
