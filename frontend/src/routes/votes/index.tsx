import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { VoteTable } from "@/features/votes/components/VoteTable";
import { useVotes } from "@/features/votes/hooks/useVotes";
import { useVoteWebSocket } from "@/features/votes/hooks/useVoteWebSocket";
import { showVoteNotification } from "@/integrations/heroui/toast-utils";

export const Route = createFileRoute("/votes/")({
	component: VotesPage,
});

function VotesPage() {
	const { data, isLoading } = useVotes();
	const queryClient = useQueryClient();

	// 투표 알림 메시지 핸들러
	const handleVoteCreated = (message: string) => {
		// HeroUI Toast 알림 표시
		showVoteNotification("투표 알림", message);

		// TanStack Query 캐시 무효화 (투표 목록 자동 갱신)
		queryClient.invalidateQueries({ queryKey: ["votes"] });
	};

	// WebSocket 연결 (투표 목록 페이지에서만 활성화)
	useVoteWebSocket({
		enabled: true,
		onVoteCreated: handleVoteCreated,
	});

	return (
		<div className="min-h-screen">
			<div className="container mx-auto px-4 py-12 max-w-7xl">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">투표 목록</h1>
					<p className="text-gray-600 text-lg">
						진행 중인 투표에 참여하거나 결과를 확인하세요
					</p>
				</div>
				<VoteTable data={data} isLoading={isLoading} />
			</div>
		</div>
	);
}
