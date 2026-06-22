import React from 'react';
import { PenTool, Compass, BookOpen, Settings, Sun } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  streak: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, streak }) => {
  const menuItems = [
    { id: 'journal', name: '夜のペン (日記)', icon: PenTool, desc: '自分と対話する日記' },
    { id: 'tracker', name: '学びの庭 (学習)', icon: Compass, desc: '学習記録と星空の成長' },
    { id: 'library', name: '書斎の記録 (本棚)', icon: BookOpen, desc: '過去の日記と学習ログ' },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 glass-panel border-r border-deepsea-700 flex flex-col justify-between p-6 z-10 rounded-none rounded-r-3xl">
      <div className="flex flex-col gap-8">
        {/* ロゴ / タイトル */}
        <div className="flex items-center gap-3 py-2 border-b border-deepsea-700">
          <div className="p-2 bg-gradient-to-tr from-biolum-blue to-biolum-cyan rounded-lg text-deepsea-950 shadow-lg shadow-biolum-cyan/30">
            <PenTool size={20} />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wider text-slate-100 uppercase">夜のペンと学びの庭</h1>
            <p className="text-[10px] text-biolum-cyan font-medium">Night Pen & Garden</p>
          </div>
        </div>

        {/* 継続日数ステータス */}
        <div className="p-4 bg-deepsea-950/40 border border-deepsea-700 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-biolum-cyan/10 rounded-lg text-biolum-cyan">
            <Sun size={20} className="animate-spin-slow" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">継続日数</div>
            <div className="text-lg font-bold text-slate-100">{streak} <span className="text-xs font-normal text-slate-400">日</span></div>
          </div>
        </div>

        {/* ナビゲーションメニュー */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-biolum-blue/20 to-biolum-cyan/5 text-biolum-cyan border-l-4 border-biolum-cyan shadow-md shadow-biolum-cyan/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-biolum-cyan drop-shadow-[0_0_5px_rgba(0,242,254,0.5)]' : 'text-slate-400'} />
                <div>
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* フッター */}
      <div className="pt-4 border-t border-deepsea-700 flex items-center justify-between text-xs text-slate-500">
        <div>夜の書斎 v1.0.0</div>
        <div className="flex gap-2">
          <button className="hover:text-slate-300 transition-colors">
            <Settings size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
};
