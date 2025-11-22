import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { createVote } from '../api/votes.api'

export const useCreateVote = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: createVote,
    onSuccess: () => {
      // 성공 시 투표 목록 페이지로 이동
      navigate({ to: '/votes' })
    },
    onSettled: () => {
      // 성공/실패 여부와 관계없이 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['votes'] })
    },
  })
}
