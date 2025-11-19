import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { createVote } from "../api/votes.api";
import type { CreateVoteRequest, Vote } from "../types/vote.types";

export const useCreateVote = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const currentUser = useAuthStore((state) => state.currentUser);

	return useMutation({
		mutationFn: createVote,
		onMutate: async (newVote: CreateVoteRequest) => {
			// 기존 쿼리 취소
			await queryClient.cancelQueries({ queryKey: ["votes"] });

			// 이전 상태 저장
			const previousVotes = queryClient.getQueryData<Vote[]>(["votes"]);

			// Optimistic Update
			if (previousVotes && currentUser) {
				const optimisticVote: Vote = {
					id: `temp-${Date.now()}`,
					title: newVote.title,
					status: "OPEN",
					author: currentUser.name,
					authorId: currentUser.id,
					createdAt: new Date().toISOString(),
				};

				queryClient.setQueryData<Vote[]>(
					["votes"],
					[optimisticVote, ...previousVotes],
				);
			}

			return { previousVotes };
		},
		onSuccess: () => {
			// 성공 시 투표 목록 페이지로 이동
			navigate({ to: "/votes" });
		},
		onError: (_error, _newVote, context) => {
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
