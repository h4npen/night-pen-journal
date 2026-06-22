import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Journal } from './components/Journal';
import { Tracker } from './components/Tracker';
import { Library } from './components/Library';
import type { JournalEntry, StudyLog } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<string>('journal');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [logs, setLogs] = useState<StudyLog[]>([]);
  const [streak, setStreak] = useState<number>(0);

  // 初回データ読み込み
  useEffect(() => {
    const savedEntries = localStorage.getItem('night_journal_entries');
    const savedLogs = localStorage.getItem('night_study_logs');

    if (savedEntries) setEntries(JSON.parse(savedEntries));
    if (savedLogs) setLogs(JSON.parse(savedLogs));
  }, []);

  // データ保存時のストレーク更新
  useEffect(() => {
    calculateStreak(logs);
  }, [logs]);

  // ストリーク計算ロジック
  const calculateStreak = (currentLogs: StudyLog[]) => {
    if (currentLogs.length === 0) {
      setStreak(0);
      return;
    }

    // 重複を除いた学習日（降順ソート）
    const uniqueDates = Array.from(new Set(currentLogs.map((log) => log.date))).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // 最新の学習日が今日または昨日でない場合、ストリークは0
    if (uniqueDates[0] !== todayStr && uniqueDates[0] !== yesterdayStr) {
      setStreak(0);
      return;
    }

    let count = 0;
    let expectedDate = new Date(uniqueDates[0]);

    for (let i = 0; i < uniqueDates.length; i++) {
      const currentDate = new Date(uniqueDates[i]);
      const diffTime = Math.abs(expectedDate.getTime() - currentDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // 日付が連続しているかチェック (初回のループは diffDays = 0)
      if (diffDays <= 1) {
        count++;
        expectedDate = currentDate; // 次の比較対象を更新
      } else {
        break; // 連続が途切れた
      }
    }

    setStreak(count);
  };

  // 日記の保存
  const handleSaveEntry = (
    title: string,
    content: string,
    mood: string,
    prompts: { question: string; answer: string }[]
  ) => {
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      title,
      content,
      mood,
      prompts,
    };

    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    localStorage.setItem('night_journal_entries', JSON.stringify(updatedEntries));
  };

  // 学習ログの追加
  const handleAddLog = (subject: string, duration: number, memo: string) => {
    const newLog: StudyLog = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      subject,
      duration,
      memo,
    };

    const updatedLogs = [...logs, newLog];
    setLogs(updatedLogs);
    localStorage.setItem('night_study_logs', JSON.stringify(updatedLogs));
  };

  return (
    <div className="min-h-screen text-slate-100 flex relative">
      {/* 流星（アニメーション装飾） */}
      <div className="absolute top-20 right-40 w-[2px] h-[2px] bg-white rounded-full opacity-0 pointer-events-none animate-shooting-star" style={{ animationDelay: '2s' }} />
      <div className="absolute top-40 right-[60%] w-[1.5px] h-[1.5px] bg-white rounded-full opacity-0 pointer-events-none animate-shooting-star" style={{ animationDelay: '7s' }} />

      {/* サイドバー */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} streak={streak} />

      {/* メインコンテンツエリア */}
      <main className="flex-1 ml-64 p-8 min-h-screen relative z-10">
        {activeTab === 'journal' && <Journal onSaveEntry={handleSaveEntry} />}
        {activeTab === 'tracker' && <Tracker logs={logs} onAddLog={handleAddLog} />}
        {activeTab === 'library' && <Library entries={entries} logs={logs} />}
      </main>

      {/* CSSのインライン追加（流星アニメーション用） */}
      <style>{`
        @keyframes shootingStar {
          0% {
            transform: rotate(-45deg) translateX(0);
            opacity: 0;
            width: 0px;
          }
          10% {
            opacity: 1;
            width: 80px;
          }
          20% {
            transform: rotate(-45deg) translateX(-150px);
            opacity: 0;
            width: 0px;
          }
          100% {
            transform: rotate(-45deg) translateX(-150px);
            opacity: 0;
            width: 0px;
          }
        }
        .animate-shooting-star {
          animation: shootingStar 12s infinite linear;
          box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.5);
        }
        .animate-spin-slow {
          animation: spin 10s infinite linear;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .writing-vertical-rl {
          writing-mode: vertical-rl;
        }
      `}</style>
    </div>
  );
}

export default App;
