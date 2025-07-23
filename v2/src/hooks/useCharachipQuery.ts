import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'

export function useCharachipQuery(charaChipId: number) {
  return useQuery({
    queryKey: ['charachip', charaChipId],
    queryFn: () =>
      apiClient.GET('/charachips/{charaChipId}', { params: { path: { charaChipId } } }),
    enabled: !!charaChipId,
  })
}
