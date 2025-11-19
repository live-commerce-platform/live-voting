import { createFileRoute } from "@tanstack/react-router";
import { Spinner } from "@heroui/react";
import { useVoteDetail } from "@/features/votes/hooks/useVoteDetail";
import { VoteStatusBadge } from "@/features/votes/components/VoteStatusBadge";
import { VoteResultItem } from "@/features/votes/components/VoteResultItem";
import { ButtonLink } from "@/components/ButtonLink";

export const Route = createFileRoute("/votes/$id/result")({
  component: VoteResultPage,
});

function VoteResultPage() {
  const { id } = Route.useParams();
  const { data, isLoading, error } = useVoteDetail(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" label="투표 결과를 불러오는 중..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">
              투표를 찾을 수 없습니다
            </h1>
            <p className="text-gray-600">
              요청하신 투표가 존재하지 않거나 결과를 조회할 수 없습니다.
            </p>
            <ButtonLink to="/votes" variant="flat" size="lg">
              목록으로 돌아가기
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  // 득표순으로 정렬
  const sortedCandidates = [...data.candidates].sort(
    (a, b) => b.voteCount - a.voteCount
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-12">
        {/* 헤더 */}
        <div className="space-y-4">
          <VoteStatusBadge status={data.status} />
          <h1 className="text-4xl font-bold text-gray-900 mt-4">
            {data.title}
          </h1>
          <p className="text-gray-600 text-lg">
            총 {data.totalVotes}명이 참여했습니다
          </p>
        </div>

        {/* 결과 목록 */}
        <div className="space-y-6">
          {sortedCandidates.map((candidate, index) => (
            <VoteResultItem
              key={candidate.id}
              candidate={candidate}
              totalVotes={data.totalVotes}
              rank={index + 1}
            />
          ))}
        </div>

        {/* 하단 액션 */}
        <div className="flex justify-center">
          <ButtonLink to="/votes" variant="flat" size="lg">
            목록으로 돌아가기
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
