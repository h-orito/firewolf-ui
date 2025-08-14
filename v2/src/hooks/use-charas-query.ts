import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'

export function useCharasQuery(charachipIds: number[]) {
  return useQuery({
    queryKey: ['charas', charachipIds],
    queryFn: async () => {
      const result = await apiClient.GET('/charas', {
        params: { query: { form: { charachip_ids: charachipIds } } },
      })
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (result.error) {
        throw new Error('Failed to fetch characters')
      }
      return result
    },
    enabled: charachipIds.length > 0,
  })
}
