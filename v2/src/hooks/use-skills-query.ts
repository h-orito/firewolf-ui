import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'

export function useSkillsQuery() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/skill/list')

      // エラーはより上位でハンドリング済み

      return data
    },
    staleTime: 1000 * 60 * 10, // 10分間キャッシュ（役職は変更頻度が低いため）
  })
}
