import { useState, useEffect, useMemo } from 'react';
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

    const uniqueDates = Array.from(new Set(currentLogs.map((log) => log.date))).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

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

      if (diffDays <= 1) {
        count++;
        expectedDate = currentDate;
      } else {
        break;
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

  // 泡のアニメーション要素の生成
  const bubbles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => {
      const size = Math.random() * 15 + 5;
      const left = Math.random() * 100;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 15;
      return (
        <div
          key={i}
          className="bubble"
          style={{
            width: \`\${size}px\`,
            height: \`\${size}px\`,
            left: \`\${left}%\`,
            animationDuration: \`\${duration}s\`,
            animationDelay: \`\${delay}s\`
          }}
        />
      );
    });
  }, []);

  return (
    <div className="min-h-screen text-slate-100 flex relative overflow-hidden bg-deepsea-900">
      {/* キラキラとした深海の泡アニメーション */}
      <div className="bubbles-container z-0">
        {bubbles}
      </div>

      {/* サイドバー */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} streak={streak} />

      {/* メインコンテンツエリア */}
      <main className="flex-1 ml-64 p-8 min-h-screen relative z-10">
        {activeTab === 'journal' && <Journal onSaveEntry={handleSaveEntry} />}
        {activeTab === 'tracker' && <Tracker logs={logs} onAddLog={handleAddLog} />}
        {activeTab === 'library' && <Library entries={entries} logs={logs} />}
      </main>

      {/* ユーティリティインラインスタイル */}
      <style>{`
        .animate-spin-slow {
          animation: spin 10s infinite linear;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
