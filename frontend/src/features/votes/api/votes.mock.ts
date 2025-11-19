import { http, HttpResponse } from 'msw'
import type { CreateVoteRequest, Vote } from '../types/vote.types'

// Mock 데이터
let mockVotes: Vote[] = [
  {
    id: '1',
    title: '점심 메뉴 선택',
    status: 'OPEN',
    author: '김철수',
    createdAt: '2025-01-15T09:00:00Z',
  },
  {
    id: '2',
    title: '회의 시간 투표',
    status: 'OPEN',
    author: '이영희',
    createdAt: '2025-01-14T14:30:00Z',
  },
  {
    id: '3',
    title: '팀 빌딩 장소',
    status: 'CLOSED',
    author: '박민수',
    createdAt: '2025-01-10T10:00:00Z',
    closedAt: '2025-01-12T18:00:00Z',
  },
  {
    id: '4',
    title: '프로젝트 우선순위',
    status: 'CLOSED',
    author: '최지원',
    createdAt: '2025-01-08T11:00:00Z',
    closedAt: '2025-01-09T17:00:00Z',
  },
]

export const voteHandlers = [
  // 투표 목록 조회
  http.get('/api/votes', () => {
    return HttpResponse.json(mockVotes)
  }),

  // 투표 생성
  http.post('/api/votes', async ({ request }) => {
    const body = (await request.json()) as CreateVoteRequest

    const newVote: Vote = {
      id: String(mockVotes.length + 1),
      title: body.title,
      status: 'OPEN',
      author: '현재 사용자', // TODO: 실제 인증된 사용자로 대체
      createdAt: new Date().toISOString(),
    }

    mockVotes = [newVote, ...mockVotes]

    return HttpResponse.json(newVote, { status: 201 })
  }),

  // 투표 종료
  http.patch('/api/votes/:id/close', ({ params }) => {
    const { id } = params
    const voteIndex = mockVotes.findIndex((vote) => vote.id === id)

    if (voteIndex === -1) {
      return new HttpResponse(null, { status: 404 })
    }

    const closedVote: Vote = {
      ...mockVotes[voteIndex],
      status: 'CLOSED',
      closedAt: new Date().toISOString(),
    }

    mockVotes[voteIndex] = closedVote

    return HttpResponse.json(closedVote)
  }),
]
