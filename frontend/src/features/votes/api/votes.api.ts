import type { CreateVoteRequest, Vote, VoteDetail, SubmitVoteRequest, VoteRecord } from '../types/vote.types'

const API_BASE_URL = '/api/votes'

export const fetchVotes = async (): Promise<Vote[]> => {
  const response = await fetch(API_BASE_URL)

  if (!response.ok) {
    throw new Error('Failed to fetch votes')
  }

  return response.json()
}

export const createVote = async (data: CreateVoteRequest): Promise<Vote> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to create vote')
  }

  return response.json()
}

export const closeVote = async (id: string): Promise<Vote> => {
  const response = await fetch(`${API_BASE_URL}/${id}/close`, {
    method: 'PATCH',
  })

  if (!response.ok) {
    throw new Error('Failed to close vote')
  }

  return response.json()
}

export const fetchVoteDetail = async (id: string): Promise<VoteDetail> => {
  const response = await fetch(`${API_BASE_URL}/${id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch vote detail')
  }

  return response.json()
}

export const submitVote = async (data: SubmitVoteRequest): Promise<VoteRecord> => {
  const response = await fetch(`${API_BASE_URL}/${data.voteId}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to submit vote')
  }

  return response.json()
}

export const fetchVoteRecord = async (voteId: string, voterId: string): Promise<VoteRecord | null> => {
  const response = await fetch(`${API_BASE_URL}/${voteId}/vote-record?voterId=${voterId}`)

  if (!response.ok) {
    throw new Error('Failed to fetch vote record')
  }

  return response.json()
}
