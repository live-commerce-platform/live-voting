import { useMutation, useQueryClient } from "@tanstack/react-query";
import { closeVote } from "../api/votes.api";
import type { VoteSummary } from "../types/vote.types";

export const useCloseVote = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: closeVote,
		onMutate: async (voteId: string) => {
			// 기존 쿼리 취소
			await queryClient.cancelQueries({ queryKey: ["votes"] });

			// 이전 상태 저장
			const previousVotes =
				queryClient.getQueryData<VoteSummary[]>(["votes"]);

			// Optimistic Update
			if (previousVotes) {
				queryClient.setQueryData<VoteSummary[]>(
					["votes"],
					previousVotes.map((vote) =>
						vote.id === voteId
							? {
									...vote,
									status: "CLOSED" as const,
									closedAt: new Date().toISOString(),
								}
							: vote,
					),
				);
			}

			return { previousVotes };
		},
		onError: (_error, _voteId, context) => {
			// 에러 발생 시 이전 상태로 롤백
			if (context?.previousVotes) {
				queryClient.setQueryData(["votes"], context.previousVotes);
			}
		},
		onSettled: () => {
			// 성공/실패 여부와 관계없이 쿼리 무효화
			queryClient.invalidateQueries({ queryKey: ["votes"] });
		},
	});
};
