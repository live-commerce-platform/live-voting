export type VoteStatus = "OPEN" | "CLOSED";

export interface VoteCandidate {
	id: string;
	name: string;
	voteCount: number;
}

// 투표 목록 조회용 요약 타입
export interface VoteSummary {
	id: string;
	title: string;
	status: VoteStatus;
	author: string;
	authorId: string;
	createdAt: string;
	closedAt?: string;
}

// 투표 상세 조회용 타입
export interface VoteDetail {
	id: string;
	title: string;
	status: VoteStatus;
	author: string;
	authorId: string;
	createdAt: string;
	closedAt?: string;
	candidates: VoteCandidate[];
	totalVotes: number;
}

// 하위 호환성을 위한 별칭 (기존 코드에서 Vote 타입 사용 시)
export type Vote = VoteSummary;

export interface CloseVoteRequest {
	id: string;
}

export interface CreateVoteRequest {
	title: string;
	candidates: string[];
	authorId: string;
}

export interface SubmitVoteRequest {
	voteId: string;
	candidateId: string;
	voterId: string;
}

export interface VoteRecord {
	voteId: string;
	candidateId: string;
	voterId: string;
	votedAt: string;
	updatedAt?: string;
}

// WebSocket 이벤트 타입
export interface VoteCreatedEvent {
	id: string;
	title: string;
	author: string;
	authorId: string;
	createdAt: string;
}
