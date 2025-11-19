import { http, HttpResponse } from 'msw'
import type { CreateVoteRequest, Vote } from '../types/vote.types'
import { mockMembers } from '@/features/auth/api/members.mock'

// Mock 데이터
let mockVotes: Vote[] = [
  {
    id: '1',
    title: '점심 메뉴 선택',
    status: 'OPEN',
    author: '김철수',
    authorId: '1',
    createdAt: '2025-01-15T09:00:00Z',
  },
  {
    id: '2',
    title: '회의 시간 투표',
    status: 'OPEN',
    author: '이영희',
    authorId: '2',
    createdAt: '2025-01-14T14:30:00Z',
  },
  {
    id: '3',
    title: '팀 빌딩 장소',
    status: 'CLOSED',
    author: '박민수',
    authorId: '3',
    createdAt: '2025-01-10T10:00:00Z',
    closedAt: '2025-01-12T18:00:00Z',
  },
  {
    id: '4',
    title: '프로젝트 우선순위',
    status: 'CLOSED',
    author: '최지원',
    authorId: '4',
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

    // authorId로 작성자 이름 조회
    const author = mockMembers.find((m) => m.id === body.authorId)?.name || '알 수 없음'

    const newVote: Vote = {
      id: String(mockVotes.length + 1),
      title: body.title,
      status: 'OPEN',
      author,
      authorId: body.authorId,
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
