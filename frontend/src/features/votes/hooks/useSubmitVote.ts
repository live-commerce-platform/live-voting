import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { submitVote } from "../api/votes.api";
import type { SubmitVoteRequest } from "../types/vote.types";

export const useSubmitVote = (voteId: string) => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: submitVote,
		onSuccess: (_data, variables: SubmitVoteRequest) => {
			// 투표 상세 정보 및 투표 기록 쿼리 무효화
			queryClient.invalidateQueries({ queryKey: ["vote", voteId] });
			queryClient.invalidateQueries({
				queryKey: ["voteRecord", voteId, variables.voterId],
			});

			// 결과 페이지로 자동 이동
			navigate({ to: "/votes/$id/result", params: { id: voteId } });
		},
	});
};
