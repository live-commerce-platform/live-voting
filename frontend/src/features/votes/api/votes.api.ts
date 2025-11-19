import { apiClient } from '@/shared/lib/api'
import type { CreateVoteRequest, Vote, VoteDetail, SubmitVoteRequest, VoteRecord } from '../types/vote.types'

// 투표 목록 조회
export const fetchVotes = async (): Promise<Vote[]> => {
  return apiClient.get('api/votes').json<Vote[]>()
}

// 투표 생성
export const createVote = async (data: CreateVoteRequest): Promise<Vote> => {
  return apiClient.post('api/votes', { json: data }).json<Vote>()
}

// 투표 종료
export const closeVote = async (id: string): Promise<Vote> => {
  return apiClient.patch(`api/votes/${id}/close`).json<Vote>()
}

// 투표 상세 조회
export const fetchVoteDetail = async (id: string): Promise<VoteDetail> => {
  return apiClient.get(`api/votes/${id}`).json<VoteDetail>()
}

// 투표 제출
export const submitVote = async (data: SubmitVoteRequest): Promise<VoteRecord> => {
  return apiClient.post(`api/votes/${data.voteId}/submit`, { json: data }).json<VoteRecord>()
}

// 투표 기록 조회
export const fetchVoteRecord = async (voteId: string, voterId: string): Promise<VoteRecord | null> => {
  return apiClient
    .get(`api/votes/${voteId}/vote-record`, {
      searchParams: { voterId },
    })
    .json<VoteRecord | null>()
}
