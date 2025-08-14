import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'

export function useCharachipListQuery() {
  return useQuery({
    queryKey: ['charachips'],
    queryFn: async () => {
      const result = await apiClient.GET('/charachip/list')
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (result.error) {
        throw new Error('Failed to fetch charachips')
      }
      return result
    },
  })
}
