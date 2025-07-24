import { redirect } from 'next/navigation'
import { apiClient } from '@/lib/api/client'

export default async function MyPage() {
  try {
    // 自分のプレイヤー情報を取得
    const { data: myPlayer, error } = await apiClient.GET('/my-player')

    if (error || !myPlayer) {
      // プレイヤー情報が取得できない場合はトップページにリダイレクト
      redirect('/')
    }

    // 自分のプレイヤー戦績ページにリダイレクト
    redirect(`/player-record/${myPlayer.id}`)
  } catch (error) {
    console.error('Error fetching my player info:', error)
    // エラーが発生した場合はトップページにリダイレクト
    redirect('/')
  }
}
