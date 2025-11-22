import { useQuery } from '@tanstack/react-query'
import { fetchVoteDetail } from '../api/votes.api'

export const useVoteDetail = (id: number) => {
  return useQuery({
    queryKey: ['vote', id],
    queryFn: () => fetchVoteDetail(id),
  })
}
