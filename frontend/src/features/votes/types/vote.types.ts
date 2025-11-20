import { z } from 'zod'

export type VoteStatus = 'OPEN' | 'CLOSED'

export interface Vote {
  id: number
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
  id: number
  authorId: string
}

export interface CloseVoteResponse {
  id: number
  status: string
}

export interface CreateVoteRequest {
  title: string
  candidates: string[]
  authorId: string
}

export interface CreateVoteResponse {
  id: number
}

export interface VoteCandidate {
  id: number
  name: string
  voteCount: number
}

export interface VoteDetail extends Vote {
  candidates: VoteCandidate[]
  totalVotes: number
}

export interface SubmitVoteRequest {
  candidateId: number
  voterId: string
}

export interface VoteRecord {
  voteId: number
  candidateId: number
  voterId: string
  votedAt: string
  updatedAt?: string
}

// Zod 스키마: 백엔드 응답 검증
export const VoteRecordSchema = z.object({
  voteId: z.number(),
  candidateId: z.number(),
  voterId: z.string(),
  votedAt: z.string(),
  updatedAt: z.string().optional(),
}).nullable() // null 응답 허용

// WebSocket 이벤트 타입
export interface VoteCreatedEvent {
  id: number
  title: string
  author: string
  authorId: string
  createdAt: string
}

// 개인용 알림 이벤트 타입
export interface VoteNotification {
  message: string
  voteId: number
  voterId: string
  timestamp: string
}
