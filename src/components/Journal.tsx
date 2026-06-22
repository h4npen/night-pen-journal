import React, { useState } from 'react';
import { Sparkles, Save, Edit3, ChevronRight, HelpCircle, Eye, EyeOff } from 'lucide-react';

interface JournalProps {
  onSaveEntry: (title: string, content: string, mood: string, prompts: { question: string; answer: string }[]) => void;
}

export const Journal: React.FC<JournalProps> = ({ onSaveEntry }) => {
  const [writeMode, setWriteMode] = useState<'guided' | 'free'>('guided');
  const [title, setTitle] = useState('');
  const [freeContent, setFreeContent] = useState('');
  const [mood, setMood] = useState('穏やか');
  const [previewMode, setPreviewMode] = useState<'horizontal' | 'vertical'>('horizontal');
  const [showPreview, setShowPreview] = useState(true); // PCメインのため、プレビューは標準で常時表示にする

  // ガイド（対話）モード用の状態
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    {
      id: 0,
      question: '今日、あなたの心に残った出来事（事実）は何ですか？',
      placeholder: '例：久しぶりに本を1冊読み終えた。夜風が涼しかった...',
    },
    {
      id: 1,
      question: 'その時、あなたはどのように感じましたか？（感情）',
      placeholder: '例：静かな達成感があった。どこか少し寂しい気持ちもした...',
    },
    {
      id: 2,
      question: 'なぜ、そのように感じたのだと思いますか？（内省・深掘り）',
      placeholder: '例：最近忙しくて自分自身と向き合う時間が取れていなかったからかもしれない...',
    },
    {
      id: 3,
      question: 'この出来事や感情から、何か気づいたことや明日のヒントはありますか？（種）',
      placeholder: '例：1日10分でも、静かに文字を書く時間を作ることが自分には必要だと気づいた...',
    },
  ];
  const [answers, setAnswers] = useState<string[]>(['', '', '', '']);

  const moods = ['穏やか', '寂しい', '嬉しい', '疲れた', '集中', 'もやもや'];

  // 対話の回答から日記本文を自動生成する
  const generateGuidedContent = () => {
    return `【出来事】\n${answers[0]}\n\n【感じたこと】\n${answers[1]}\n\n【その理由】\n${answers[2]}\n\n【これからの種】\n${answers[3]}`;
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    const finalContent = writeMode === 'guided' ? generateGuidedContent() : freeContent;
    const finalTitle = title.trim() || `${new Date().toLocaleDateString('ja-JP')} の記録`;
    
    const promptHistory = writeMode === 'guided' 
      ? steps.map((step, idx) => ({ question: step.question, answer: answers[idx] }))
      : [];

    onSaveEntry(finalTitle, finalContent, mood, promptHistory);

    // リセット
    setTitle('');
    setFreeContent('');
    setAnswers(['', '', '', '']);
    setCurrentStep(0);
    alert('静かに本棚へ日記をしまいました。');
  };

  const currentContent = writeMode === 'guided' ? generateGuidedContent() : freeContent;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto p-4 pb-12 fade-in">
      {/* ヘッダー */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold tracking-wider text-slate-100 flex items-center gap-2">
            <Edit3 className="text-amber-400" /> 夜のペン (ジャーナリング)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            自分の中のヤドカリ（心の声）と対話し、言葉を紡いでみましょう。PCの広い画面向けに最適化されています。
          </p>
        </div>

        {/* モード切り替え & プレビューの表示切替 */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-350 hover:text-slate-200 transition-colors"
          >
            {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>原稿プレビュー</span>
          </button>
          
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setWriteMode('guided')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                writeMode === 'guided' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              対話ガイド
            </button>
            <button
              onClick={() => setWriteMode('free')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                writeMode === 'free' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              フリー記述
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 入力エリア */}
        <div className={`glass-panel p-6 ${showPreview ? 'lg:col-span-5' : 'lg:col-span-12'} flex flex-col gap-6 transition-all duration-300`}>
          {/* タイトルと気分選択 */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">今日のタイトル</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="無題の夜"
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1.5">今日の心模様</label>
              <div className="flex flex-wrap gap-2">
                {moods.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    className={`px-3 py-1 rounded-lg text-xs transition-all border ${
                      mood === m
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.1)]'
                        : 'bg-transparent text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-slate-800" />

          {/* 対話モード */}
          {writeMode === 'guided' ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>ステップ {currentStep + 1} / {steps.length}</span>
                <span className="flex items-center gap-1"><HelpCircle size={12} /> ヤドカリの問いかけ</span>
              </div>

              <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                <p className="text-sm font-semibold text-amber-200 serif-text leading-relaxed">
                  「{steps[currentStep].question}」
                </p>
              </div>

              <textarea
                value={answers[currentStep]}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[currentStep] = e.target.value;
                  setAnswers(newAnswers);
                }}
                placeholder={steps[currentStep].placeholder}
                rows={6}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none resize-none leading-relaxed"
              />

              <div className="flex justify-between items-center mt-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                  className="px-4 py-2 border border-slate-800 text-slate-400 text-xs rounded-xl hover:bg-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  戻る
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!answers[currentStep].trim()}
                  className="px-4 py-2 bg-slate-800 text-amber-400 text-xs font-semibold rounded-xl hover:bg-slate-750 hover:text-amber-300 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1"
                >
                  <span>{currentStep === steps.length - 1 ? '完了 (保存へ)' : '次へ進む'}</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            /* フリー記述モード */
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>自由につづる</span>
                <span>{freeContent.length} 文字</span>
              </div>
              <textarea
                value={freeContent}
                onChange={(e) => setFreeContent(e.target.value)}
                placeholder="静かにペンを走らせるように、心に浮かぶ言葉をそのまま書き出してみましょう..."
                rows={14}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none resize-none leading-relaxed serif-text"
              />
            </div>
          )}
        </div>

        {/* プレビュー表示エリア (原稿用紙風、PC特化) */}
        {showPreview && (
          <div className="flex flex-col gap-4 lg:col-span-7 fade-in w-full overflow-hidden">
            <div className="flex justify-between items-center">
              <span className="text-xs text-amber-400 flex items-center gap-1"><Sparkles size={12} /> 机の上の原稿用紙</span>
              <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                <button
                  onClick={() => setPreviewMode('horizontal')}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors ${
                    previewMode === 'horizontal' ? 'bg-amber-500/10 text-amber-300' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  横書き
                </button>
                <button
                  onClick={() => setPreviewMode('vertical')}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors ${
                    previewMode === 'vertical' ? 'bg-amber-500/10 text-amber-300' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  縦書き
                </button>
              </div>
            </div>

            {/* 原稿用紙 */}
            <div className="w-full glass-panel overflow-hidden border-slate-850">
              <div
                className={`p-8 genko-paper serif-text w-full transition-all duration-300 ${
                  previewMode === 'vertical' 
                    ? 'writing-vertical-rl text-justify h-[480px] overflow-x-auto overflow-y-hidden' 
                    : 'overflow-y-auto max-h-[480px]'
                }`}
                style={{
                  writingMode: previewMode === 'vertical' ? 'vertical-rl' : 'horizontal-tb',
                  textOrientation: 'mixed',
                  direction: previewMode === 'vertical' ? 'rtl' : 'ltr', // 右から左へのスクロールをサポート
                }}
              >
                {/* 原稿用紙風タイトル */}
                <div className={`${previewMode === 'vertical' ? 'ml-8' : 'mb-6'} border-b border-amber-600/30 pb-2`}>
                  <h3 className="text-lg font-bold text-slate-800 leading-normal">{title || '無題の夜'}</h3>
                  <div className="text-xs text-slate-500 mt-1">
                    心模様: {mood}
                  </div>
                </div>

                {/* 本文 */}
                <p className="text-sm text-slate-800 leading-[32px] whitespace-pre-wrap tracking-wider">
                  {currentContent || 'ペンが止まっています。何か言葉を置いてみましょう。'}
                </p>
              </div>
            </div>

            {/* 保存ボタン */}
            <button
              onClick={handleSave}
              disabled={!currentContent.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-amber-500/20 active:scale-98 transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              <Save size={14} />
              <span>この日記を本棚へしまう</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
