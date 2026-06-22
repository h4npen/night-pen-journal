export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  createdAt: string; // ISO String
  title: string;
  content: string; // 日記の本文
  mood: string; // 感情 (穏やか, 寂しい, 嬉しい, 疲れた, 集中など)
  prompts: {
    question: string;
    answer: string;
  }[]; // 対話型ジャーナリングの質疑応答履歴
}

export interface StudyLog {
  id: string;
  date: string; // YYYY-MM-DD
  createdAt: string; // ISO String
  subject: string; // 学習内容
  duration: number; // 学習時間 (分)
  memo: string; // 一言メモ・気付き
}

export interface UserStats {
  streak: number; // 継続日数
  totalStudyTime: number; // 総学習時間
  starsCount: number; // トータルの星の数
}
