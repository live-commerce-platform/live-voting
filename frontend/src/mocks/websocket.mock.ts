/**
 * MSW WebSocket 모킹
 *
 * 실제 백엔드 WebSocket 서버 없이 개발 환경에서 WebSocket 이벤트를 시뮬레이션합니다.
 * 브라우저의 CustomEvent를 사용하여 가상 WebSocket 메시지를 발행합니다.
 */

import type { VoteCreatedEvent, VoteNotification } from '@/features/votes/types/vote.types'

/**
 * 새로운 투표 생성 이벤트를 발행합니다.
 * 개발 환경에서만 동작하며, 실제 WebSocket 대신 브라우저 이벤트로 시뮬레이션합니다.
 */
export function emitVoteCreatedEvent(vote: VoteCreatedEvent) {
  if (import.meta.env.MODE === 'development' && import.meta.env.VITE_ENABLE_MSW === 'true') {
    console.log('[MSW WebSocket] 투표 생성 이벤트 발행:', vote)

    // CustomEvent를 사용하여 WebSocket 메시지 시뮬레이션
    const event = new CustomEvent('mock-websocket-vote-created', {
      detail: vote,
    })

    window.dispatchEvent(event)
  }
}

/**
 * 투표 제출 알림 이벤트를 발행합니다. (개인용 알림)
 * 개발 환경에서만 동작하며, 실제 WebSocket 대신 브라우저 이벤트로 시뮬레이션합니다.
 */
export function emitVoteSubmittedEvent(notification: VoteNotification) {
  if (import.meta.env.MODE === 'development' && import.meta.env.VITE_ENABLE_MSW === 'true') {
    console.log('[MSW WebSocket] 투표 제출 알림 이벤트 발행:', notification)

    const event = new CustomEvent('mock-websocket-vote-submitted', {
      detail: notification,
    })

    window.dispatchEvent(event)
  }
}

/**
 * MSW WebSocket 이벤트 리스너를 등록합니다.
 * useVoteWebSocket 훅에서 실제 WebSocket 대신 이 리스너를 사용할 수 있습니다.
 */
export function setupMockWebSocketListener(
  onVoteCreated: (vote: VoteCreatedEvent) => void,
  onVoteSubmitted?: (notification: VoteNotification) => void
) {
  const voteCreatedHandler = (event: Event) => {
    const customEvent = event as CustomEvent<VoteCreatedEvent>
    onVoteCreated(customEvent.detail)
  }

  const voteSubmittedHandler = (event: Event) => {
    const customEvent = event as CustomEvent<VoteNotification>
    onVoteSubmitted?.(customEvent.detail)
  }

  window.addEventListener('mock-websocket-vote-created', voteCreatedHandler)
  window.addEventListener('mock-websocket-vote-submitted', voteSubmittedHandler)

  return () => {
    window.removeEventListener('mock-websocket-vote-created', voteCreatedHandler)
    window.removeEventListener('mock-websocket-vote-submitted', voteSubmittedHandler)
  }
}

/**
 * 개발 환경에서 테스트용 투표 생성 이벤트를 주기적으로 발행합니다.
 * 브라우저 콘솔에서 수동으로 호출하여 테스트할 수 있습니다.
 *
 * @example
 * ```ts
 * import { startMockWebSocketSimulation } from '@/mocks/websocket.mock'
 *
 * // 10초마다 랜덤 투표 생성 이벤트 발행
 * const stop = startMockWebSocketSimulation(10000)
 *
 * // 시뮬레이션 중지
 * stop()
 * ```
 */
export function startMockWebSocketSimulation(intervalMs = 30000) {
  if (import.meta.env.MODE !== 'development' || import.meta.env.VITE_ENABLE_MSW !== 'true') {
    console.warn('WebSocket 시뮬레이션은 MSW가 활성화된 개발 환경에서만 동작합니다.')
    return () => {}
  }

  const mockVotes: Omit<VoteCreatedEvent, 'id' | 'createdAt'>[] = [
    {
      title: '점심 메뉴 투표',
      author: '김철수',
      authorId: 'user-1',
    },
    {
      title: '주말 야유회 장소',
      author: '이영희',
      authorId: 'user-2',
    },
    {
      title: '팀 빌딩 활동',
      author: '박민수',
      authorId: 'user-3',
    },
  ]

  let counter = 1

  const intervalId = setInterval(() => {
    const randomVote =
      mockVotes[Math.floor(Math.random() * mockVotes.length)]
    const voteEvent: VoteCreatedEvent = {
      ...randomVote,
      id: Date.now() + counter++,
      createdAt: new Date().toISOString(),
    }

    emitVoteCreatedEvent(voteEvent)
  }, intervalMs)

  console.log(
    `[MSW WebSocket] 시뮬레이션 시작 (${intervalMs}ms 간격). 중지하려면 stop() 호출`
  )

  return () => {
    clearInterval(intervalId)
    console.log('[MSW WebSocket] 시뮬레이션 중지')
  }
}

// MSW가 활성화된 개발 환경에서 전역으로 노출 (브라우저 콘솔에서 테스트 가능)
if (import.meta.env.MODE === 'development' && import.meta.env.VITE_ENABLE_MSW === 'true') {
  ;(window as any).__mockWebSocket = {
    emitVoteCreated: emitVoteCreatedEvent,
    emitVoteSubmitted: emitVoteSubmittedEvent,
    startSimulation: startMockWebSocketSimulation,
  }

  console.log(
    '[MSW WebSocket] 개발 도구 사용 가능:\n' +
      '  __mockWebSocket.emitVoteCreated({ id, title, author, authorId, createdAt })\n' +
      '  __mockWebSocket.emitVoteSubmitted({ message, voteId, voterId, timestamp })\n' +
      '  __mockWebSocket.startSimulation(intervalMs)'
  )
}
