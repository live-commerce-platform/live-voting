import { ErrorBoundary, Suspense } from "@suspensive/react";
import { SuspenseQuery } from "@suspensive/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { fetchVoteDetail } from "@/features/votes/api/votes.api";
import { VotingErrorFallback } from "@/features/votes/components/VotingErrorFallback";
import { VotingForm } from "@/features/votes/components/VotingForm";
import { VotingLoader } from "@/features/votes/components/VotingLoader";
import { useVoteRecord } from "@/features/votes/hooks/useVoteRecord";
import type { VoteDetail } from "@/features/votes/types/vote.types";

export const Route = createFileRoute("/votes/$id/voting")({
	component: VotingPage,
});

function VotingPage() {
	const { id } = Route.useParams();

	return (
		<ErrorBoundary fallback={VotingErrorFallback}>
			<Suspense fallback={<VotingLoader />}>
				<SuspenseQuery
					queryKey={["vote", id]}
					queryFn={() => fetchVoteDetail(id)}
				>
					{({ data }) => <VotingContent voteData={data} voteId={id} />}
				</SuspenseQuery>
			</Suspense>
		</ErrorBoundary>
	);
}

// Hook을 최상위에서 호출하기 위한 별도 컴포넌트
function VotingContent({
	voteData,
	voteId,
}: {
	voteData: VoteDetail;
	voteId: string;
}) {
	const currentUser = useAuthStore((state) => state.currentUser);
	const navigate = useNavigate();

	// Hook을 컴포넌트 최상위에서 호출
	const { data: existingRecord } = useVoteRecord(voteData.id, currentUser?.id);

	// 투표가 종료된 경우 결과 페이지로 리다이렉트
	useEffect(() => {
		if (voteData.status === "CLOSED") {
			navigate({ to: "/votes/$id/result", params: { id: voteId } });
		}
	}, [voteData.status, voteId, navigate]);

	// 종료된 투표인 경우 로더 표시
	if (voteData.status === "CLOSED") {
		return <VotingLoader />;
	}

	if (!currentUser) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-gray-600">로그인이 필요합니다.</p>
			</div>
		);
	}

	return (
		<VotingForm
			vote={voteData}
			existingRecord={existingRecord}
			currentUserId={currentUser.id}
		/>
	);
}
