import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/votes/$id/result')({
  component: ResultPage,
})

function ResultPage() {
  const { id } = Route.useParams()

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">투표 결과</h1>
      <p className="text-gray-600">투표 ID: {id}</p>
      <div className="mt-8 p-8 bg-gray-100 rounded-lg">
        <p className="text-center text-gray-500">이 페이지는 아직 구현되지 않았습니다.</p>
      </div>
    </div>
  )
}
