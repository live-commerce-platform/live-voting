import { createFileRoute } from '@tanstack/react-router'
import { VoteTable } from '@/features/votes/components/VoteTable'
import { useVotes } from '@/features/votes/hooks/useVotes'

export const Route = createFileRoute('/votes/')({
  component: VotesPage,
})

function VotesPage() {
  const { data, isLoading } = useVotes()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            투표 목록
          </h1>
          <p className="text-gray-600 text-lg">
            진행 중인 투표에 참여하거나 결과를 확인하세요
          </p>
        </div>
        <VoteTable data={data} isLoading={isLoading} />
      </div>
    </div>
  )
}
