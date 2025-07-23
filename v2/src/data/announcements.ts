import type { Announcement } from '@/types/announcement'

export const announcements: Announcement[] = [
  {
    id: 1,
    title: 'v2.0リリース',
    content:
      'FIREWOLF UIをNext.js 15で刷新しました。パフォーマンスとユーザビリティが大幅に向上しています。',
    date: '2025/03/20',
    version: 'v2.0.0',
    type: 'feature',
  },
  {
    id: 2,
    title: '村カード情報の拡充',
    content: '村カードに更新時刻、発言可能時間、ダミー役欠けの有無、年齢制限の表示を追加しました。',
    date: '2025/03/15',
    version: 'v1.9.8',
    type: 'improvement',
  },
  {
    id: 3,
    title: 'キャラチップ詳細機能の追加',
    content: '個別キャラクターの詳細情報を確認できるページを追加しました。',
    date: '2025/03/10',
    version: 'v1.9.7',
    type: 'feature',
  },
  {
    id: 4,
    title: '占い師役職の追加',
    content: '占い師役職を新たに追加し、ゲームバランスを調整しました。',
    date: '2025/03/05',
    version: 'v1.9.6',
    type: 'feature',
  },
  {
    id: 5,
    title: 'プレイヤー戦績機能の改善',
    content: '戦績グラフの表示を最適化し、読み込み速度を向上させました。',
    date: '2025/03/01',
    version: 'v1.9.5',
    type: 'improvement',
  },
  {
    id: 6,
    title: 'モバイル端末での表示改善',
    content: 'スマートフォンやタブレットでの操作性を向上させました。',
    date: '2025/02/25',
    version: 'v1.9.4',
    type: 'improvement',
  },
  {
    id: 7,
    title: '新しいキャラチップセットの追加',
    content: '春の新作キャラチップセット「桜の街」を追加しました。',
    date: '2025/02/20',
    version: 'v1.9.3',
    type: 'feature',
  },
  {
    id: 8,
    title: 'セキュリティ強化',
    content: 'ユーザーデータの保護を強化し、より安全にご利用いただけるようになりました。',
    date: '2025/02/15',
    version: 'v1.9.2',
    type: 'improvement',
  },
  {
    id: 9,
    title: '投票システムの改善',
    content: '投票時の確認ダイアログを改善し、誤投票を防ぎやすくしました。',
    date: '2025/02/10',
    version: 'v1.9.1',
    type: 'improvement',
  },
  {
    id: 10,
    title: '新年イベント開始',
    content: '新年特別イベント「新春人狼祭り」を開催中です。',
    date: '2025/01/01',
    version: 'v1.9.0',
    type: 'announcement',
  },
]

export function getLatestAnnouncements(count: number = 2): Announcement[] {
  return announcements.slice(0, count)
}

export function getAllAnnouncements(): Announcement[] {
  return announcements
}
