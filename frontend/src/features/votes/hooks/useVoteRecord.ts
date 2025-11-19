import { useQuery } from "@tanstack/react-query";
import { fetchVoteRecord } from "../api/votes.api";

export const useVoteRecord = (voteId: string, voterId: string | undefined) => {
	return useQuery({
		queryKey: ["voteRecord", voteId, voterId],
		queryFn: () => fetchVoteRecord(voteId, voterId!),
		enabled: !!voterId, // voterId가 있을 때만 쿼리 실행
	});
};
