import { createFileRoute } from "@tanstack/react-router";
import { Suspense, ErrorBoundary } from "@suspensive/react";
import { SuspenseQuery } from "@suspensive/react-query";
import { fetchVoteDetail } from "@/features/votes/api/votes.api";
import { VoteStatusBadge } from "@/features/votes/components/VoteStatusBadge";
import { VoteResultItem } from "@/features/votes/components/VoteResultItem";
import { VoteResultLoader } from "@/features/votes/components/VoteResultLoader";
import { VoteResultErrorFallback } from "@/features/votes/components/VoteResultErrorFallback";
import { ButtonLink } from "@/components/ButtonLink";

export const Route = createFileRoute("/votes/$id/result")({
  component: VoteResultPage,
});

function VoteResultPage() {
  const { id } = Route.useParams();

  return (
    <ErrorBoundary fallback={VoteResultErrorFallback}>
      <Suspense fallback={<VoteResultLoader />}>
        <SuspenseQuery
          queryKey={["vote", id]}
          queryFn={() => fetchVoteDetail(id)}
        >
          {({ data }) => {
            // 득표순으로 정렬
            const sortedCandidates = [...data.candidates].sort(
              (a, b) => b.voteCount - a.voteCount
            );

            return (
              <div className="min-h-screen">
                <div className="container mx-auto px-4 py-12 max-w-2xl">
                  <div className="space-y-8">
                    {/* 헤더 */}
                    <div className="text-center space-y-2">
                      <VoteStatusBadge status={data.status} />
                      <h1 className="text-3xl font-bold text-gray-900">
                        {data.title}
                      </h1>
                      <p className="text-sm text-gray-600">
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
                    <div className="flex gap-3 justify-center">
                      <ButtonLink to="/votes" variant="flat" size="lg">
                        목록으로
                      </ButtonLink>
                      {data.status === 'OPEN' && (
                        <ButtonLink
                          to="/votes/$id/voting"
                          params={{ id }}
                          color="primary"
                          size="lg"
                        >
                          투표하기
                        </ButtonLink>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
        </SuspenseQuery>
      </Suspense>
    </ErrorBoundary>
  );
}
