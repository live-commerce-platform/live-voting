import { createFileRoute } from '@tanstack/react-router'
import { VoteForm } from '@/features/votes/components/VoteForm'

export const Route = createFileRoute('/votes/new')({
  component: VoteNewPage,
})

function VoteNewPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">새 투표 만들기</h1>
            <p className="mt-2 text-sm text-gray-600">투표 제목과 후보를 입력하여 새로운 투표를 생성하세요</p>
          </div>
          <VoteForm />
        </div>
      </div>
    </div>
  )
}
