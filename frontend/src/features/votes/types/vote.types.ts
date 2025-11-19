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
