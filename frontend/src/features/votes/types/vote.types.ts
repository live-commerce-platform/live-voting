import { z } from 'zod'

export type VoteStatus = 'OPEN' | 'CLOSED'

export interface Vote {
  id: string
  title: string
  status: VoteStatus
  author: string
  authorId: string
  createdAt: string
  closedAt?: string
  candidates?: VoteCandidate[]
  totalVotes?: number
}

export interface CloseVoteRequest {
  id: string
}

export interface CreateVoteRequest {
  title: string
  candidates: string[]
  authorId: string
}

export interface VoteCandidate {
  id: string
  name: string
  voteCount: number
}

export interface VoteDetail extends Vote {
  candidates: VoteCandidate[]
  totalVotes: number
}

export interface SubmitVoteRequest {
  voteId: string
  candidateId: string
  voterId: string
}

export interface VoteRecord {
  voteId: string
  candidateId: string
  voterId: string
  votedAt: string
  updatedAt?: string
}

// Zod 스키마: 백엔드 응답 검증 및 타입 변환
export const VoteRecordSchema = z.object({
  voteId: z.coerce.string(),      // Long → string 자동 변환
  candidateId: z.coerce.string(), // Long → string 자동 변환
  voterId: z.string(),
  votedAt: z.string(),
  updatedAt: z.string().optional(),
}).nullable() // null 응답 허용

// WebSocket 이벤트 타입
export interface VoteCreatedEvent {
  id: string
  title: string
  author: string
  authorId: string
  createdAt: string
}
