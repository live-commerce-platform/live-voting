export type VoteStatus = 'OPEN' | 'CLOSED'

export interface Vote {
  id: string
  title: string
  status: VoteStatus
  author: string
  createdAt: string
  closedAt?: string
}

export interface CloseVoteRequest {
  id: string
}
