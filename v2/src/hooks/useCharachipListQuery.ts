import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'

export function useCharachipListQuery() {
  return useQuery({
    queryKey: ['charachips'],
    queryFn: () =>
      apiClient.GET('/charachips', {
        params: {
          query: {
            form: {},
          },
        },
      }),
  })
}
