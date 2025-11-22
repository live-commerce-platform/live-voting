import { useQuery } from '@tanstack/react-query'
import { fetchVotes } from '../api/votes.api'

export const useVotes = () => {
  return useQuery({
    queryKey: ['votes'],
    queryFn: fetchVotes,
  })
}
