import { useEffect, useRef, useState } from 'react'
import { Client, type IMessage } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import type { VoteCreatedEvent } from '../types/vote.types'
import { setupMockWebSocketListener } from '@/mocks/websocket.mock'

interface UseVoteWebSocketOptions {
  enabled: boolean
  onVoteCreated?: (vote: VoteCreatedEvent) => void
}

interface UseVoteWebSocketReturn {
  isConnected: boolean
  error: Error | null
}

/**
 * 실시간 투표 이벤트를 수신하는 WebSocket 훅
 *
 * @param options.enabled - WebSocket 연결 활성화 여부
 * @param options.onVoteCreated - 새로운 투표가 생성되었을 때 호출되는 콜백
 * @returns isConnected - 연결 상태, error - 에러 정보
 */
export function useVoteWebSocket({
  enabled,
  onVoteCreated,
}: UseVoteWebSocketOptions): UseVoteWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const clientRef = useRef<Client | null>(null)

  useEffect(() => {
    if (!enabled) {
      return
    }

    // 개발 환경에서는 MSW Mock WebSocket 사용
    if (import.meta.env.DEV && import.meta.env.MODE === 'development') {
      console.log('[WebSocket] MSW Mock WebSocket 사용 (개발 환경)')
      setIsConnected(true)
      setError(null)

      // MSW WebSocket 이벤트 리스너 등록
      const cleanup = setupMockWebSocketListener((vote) => {
        console.log('[Mock WebSocket] 새로운 투표 이벤트 수신:', vote)
        onVoteCreated?.(vote)
      })

      return cleanup
    }

    // 프로덕션 환경에서는 실제 STOMP 클라이언트 사용
    const client = new Client({
      webSocketFactory: () =>
        new SockJS(import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws'),

      // 자동 재연결 설정
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      // 연결 성공 시
      onConnect: () => {
        console.log('[WebSocket] 연결 성공')
        setIsConnected(true)
        setError(null)

        // 새로운 투표 생성 토픽 구독
        client.subscribe('/topic/vote-created', (message: IMessage) => {
          try {
            const voteCreatedEvent: VoteCreatedEvent = JSON.parse(message.body)
            console.log('[WebSocket] 새로운 투표 이벤트 수신:', voteCreatedEvent)
            onVoteCreated?.(voteCreatedEvent)
          } catch (err) {
            console.error('[WebSocket] 메시지 파싱 실패:', err)
            setError(
              err instanceof Error ? err : new Error('메시지 파싱 실패')
            )
          }
        })
      },

      // 연결 실패 시
      onStompError: (frame) => {
        console.error('[WebSocket] STOMP 에러:', frame)
        setIsConnected(false)
        setError(new Error(frame.headers['message'] || 'WebSocket 에러 발생'))
      },

      // 연결 끊김 시
      onWebSocketClose: () => {
        console.log('[WebSocket] 연결 종료')
        setIsConnected(false)
      },

      // 디버그 로그
      debug: (str) => {
        console.log('[WebSocket Debug]', str)
      },
    })

    clientRef.current = client

    // WebSocket 연결 활성화
    client.activate()

    // 클린업: 컴포넌트 언마운트 시 연결 종료
    return () => {
      if (clientRef.current) {
        console.log('[WebSocket] 연결 해제')
        clientRef.current.deactivate()
        clientRef.current = null
      }
    }
  }, [enabled, onVoteCreated])

  return {
    isConnected,
    error,
  }
}
