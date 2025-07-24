import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'

export function useCharasQuery(charachipIds: number[]) {
  return useQuery({
    queryKey: ['charas', charachipIds],
    queryFn: () =>
      apiClient.GET('/charas', {
        params: { query: { form: { charachip_ids: charachipIds } } },
      }),
    enabled: charachipIds.length > 0,
  })
}
