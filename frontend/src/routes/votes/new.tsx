import { createFileRoute } from '@tanstack/react-router'
import { VoteForm } from '@/features/votes/components/VoteForm'

export const Route = createFileRoute('/votes/new')({
  component: VoteNewPage,
})

function VoteNewPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">새 투표 만들기</h1>
          <p className="text-gray-600 text-lg">투표 제목과 후보를 입력하여 새로운 투표를 생성하세요</p>
        </div>
        <VoteForm />
      </div>
    </div>
  )
}
