import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Suspense, ErrorBoundary } from '@suspensive/react'
import { SuspenseQuery } from '@suspensive/react-query'
import { fetchVoteDetail } from '@/features/votes/api/votes.api'
import { VotingForm } from '@/features/votes/components/VotingForm'
import { VotingLoader } from '@/features/votes/components/VotingLoader'
import { VotingErrorFallback } from '@/features/votes/components/VotingErrorFallback'
import { useVoteRecord } from '@/features/votes/hooks/useVoteRecord'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { useEffect } from 'react'

export const Route = createFileRoute('/votes/$id/voting')({
  component: VotingPage,
})

function VotingPage() {
  const { id } = Route.useParams()
  const voteId = Number(id)
  const currentUser = useAuthStore((state) => state.currentUser)
  const navigate = useNavigate()

  return (
    <ErrorBoundary fallback={VotingErrorFallback}>
      <Suspense fallback={<VotingLoader />}>
        <SuspenseQuery
          queryKey={['vote', voteId]}
          queryFn={() => fetchVoteDetail(voteId)}
        >
          {({ data }) => {
            // 투표가 종료된 경우 결과 페이지로 리다이렉트
            if (data.status === 'CLOSED') {
              useEffect(() => {
                navigate({ to: '/votes/$id/result', params: { id } })
              }, [])
              return <VotingLoader />
            }

            if (!currentUser) {
              return (
                <div className="min-h-screen flex items-center justify-center">
                  <p className="text-gray-600">로그인이 필요합니다.</p>
                </div>
              )
            }

            const { data: existingRecord } = useVoteRecord(voteId, currentUser.id)

            return (
              <VotingForm
                vote={data}
                existingRecord={existingRecord}
                currentUserId={currentUser.id}
              />
            )
          }}
        </SuspenseQuery>
      </Suspense>
    </ErrorBoundary>
  )
}
