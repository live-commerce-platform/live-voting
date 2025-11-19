import { HttpResponse, http } from "msw";
import { mockMembers } from "@/features/auth/api/members.mock";
import { emitVoteCreatedEvent } from "@/mocks/websocket.mock";
import type {
	CreateVoteRequest,
	SubmitVoteRequest,
	Vote,
	VoteCandidate,
	VoteCreatedEvent,
	VoteDetail,
	VoteRecord,
} from "../types/vote.types";

// Mock 투표 기록 저장소
const mockVoteRecords: VoteRecord[] = [];

// Mock 데이터
let mockVotes: Vote[] = [
	{
		id: "1",
		title: "점심 메뉴 선택",
		status: "OPEN",
		author: "김철수",
		authorId: "1",
		createdAt: "2025-01-15T09:00:00Z",
		candidates: [
			{ id: "1", name: "한식", voteCount: 0 },
			{ id: "2", name: "중식", voteCount: 0 },
			{ id: "3", name: "일식", voteCount: 0 },
			{ id: "4", name: "양식", voteCount: 0 },
		],
		totalVotes: 0,
	},
	{
		id: "2",
		title: "회의 시간 투표",
		status: "OPEN",
		author: "이영희",
		authorId: "2",
		createdAt: "2025-01-14T14:30:00Z",
		candidates: [
			{ id: "1", name: "오전 10시", voteCount: 0 },
			{ id: "2", name: "오후 2시", voteCount: 0 },
			{ id: "3", name: "오후 4시", voteCount: 0 },
		],
		totalVotes: 0,
	},
	{
		id: "3",
		title: "팀 빌딩 장소",
		status: "CLOSED",
		author: "박민수",
		authorId: "3",
		createdAt: "2025-01-10T10:00:00Z",
		closedAt: "2025-01-12T18:00:00Z",
		candidates: [
			{ id: "1", name: "제주도", voteCount: 28 },
			{ id: "2", name: "강릉", voteCount: 25 },
			{ id: "3", name: "부산", voteCount: 18 },
			{ id: "4", name: "경주", voteCount: 9 },
		],
		totalVotes: 80,
	},
	{
		id: "4",
		title: "프로젝트 우선순위",
		status: "CLOSED",
		author: "최지원",
		authorId: "4",
		createdAt: "2025-01-08T11:00:00Z",
		closedAt: "2025-01-09T17:00:00Z",
		candidates: [
			{ id: "1", name: "사용자 인증 개선", voteCount: 45 },
			{ id: "2", name: "대시보드 UI 개선", voteCount: 32 },
			{ id: "3", name: "성능 최적화", voteCount: 28 },
			{ id: "4", name: "모바일 앱 개발", voteCount: 15 },
		],
		totalVotes: 120,
	},
];

export const voteHandlers = [
	// 투표 목록 조회
	http.get("/api/votes", () => {
		return HttpResponse.json(mockVotes);
	}),

	// 투표 상세 조회
	http.get("/api/votes/:id", ({ params }) => {
		const { id } = params;
		const vote = mockVotes.find((v) => v.id === id);

		if (!vote) {
			return new HttpResponse(null, { status: 404 });
		}

		return HttpResponse.json(vote as VoteDetail);
	}),

	// 투표 생성
	http.post("/api/votes", async ({ request }) => {
		const body = (await request.json()) as CreateVoteRequest;

		// authorId로 작성자 이름 조회
		const author =
			mockMembers.find((m) => m.id === body.authorId)?.name || "알 수 없음";

		// 후보자 배열 생성 (각 후보자에 ID 할당 및 초기 투표수 0)
		const candidates: VoteCandidate[] = body.candidates.map((name, index) => ({
			id: String(index + 1),
			name,
			voteCount: 0,
		}));

		const newVote: Vote = {
			id: String(mockVotes.length + 1),
			title: body.title,
			status: "OPEN",
			author,
			authorId: body.authorId,
			createdAt: new Date().toISOString(),
			candidates, // 후보자 배열 포함
			totalVotes: 0, // 총 투표수 초기화
		};

		mockVotes = [newVote, ...mockVotes];

		// WebSocket 이벤트 발행 (500ms 후 실시간 이벤트 시뮬레이션)
		setTimeout(() => {
			const voteCreatedEvent: VoteCreatedEvent = {
				id: newVote.id,
				title: newVote.title,
				author: newVote.author,
				authorId: newVote.authorId,
				createdAt: newVote.createdAt,
			};
			emitVoteCreatedEvent(voteCreatedEvent);
		}, 500);

		return HttpResponse.json(newVote, { status: 201 });
	}),

	// 투표 종료
	http.patch("/api/votes/:id/close", ({ params }) => {
		const { id } = params;
		const voteIndex = mockVotes.findIndex((vote) => vote.id === id);

		if (voteIndex === -1) {
			return new HttpResponse(null, { status: 404 });
		}

		const closedVote: Vote = {
			...mockVotes[voteIndex],
			status: "CLOSED",
			closedAt: new Date().toISOString(),
		};

		mockVotes[voteIndex] = closedVote;

		return HttpResponse.json(closedVote);
	}),

	// 투표 제출
	http.post("/api/votes/:id/submit", async ({ params, request }) => {
		const { id } = params;
		const body = (await request.json()) as SubmitVoteRequest;

		const vote = mockVotes.find((v) => v.id === id);
		if (!vote) {
			return new HttpResponse(null, { status: 404 });
		}

		if (vote.status === "CLOSED") {
			return new HttpResponse(
				JSON.stringify({ message: "종료된 투표입니다." }),
				{ status: 400 },
			);
		}

		// 기존 투표 기록 확인
		const existingRecordIndex = mockVoteRecords.findIndex(
			(record) =>
				record.voteId === body.voteId && record.voterId === body.voterId,
		);

		const now = new Date().toISOString();

		if (existingRecordIndex !== -1) {
			// 기존 투표 변경: 이전 후보의 voteCount 감소
			const oldCandidateId = mockVoteRecords[existingRecordIndex].candidateId;
			if (vote.candidates && oldCandidateId !== body.candidateId) {
				const oldCandidate = vote.candidates.find(
					(c) => c.id === oldCandidateId,
				);
				if (oldCandidate) {
					oldCandidate.voteCount = Math.max(0, oldCandidate.voteCount - 1);
				}
			}

			// 투표 기록 업데이트
			mockVoteRecords[existingRecordIndex] = {
				...mockVoteRecords[existingRecordIndex],
				candidateId: body.candidateId,
				updatedAt: now,
			};
		} else {
			// 새 투표
			const newRecord: VoteRecord = {
				voteId: body.voteId,
				candidateId: body.candidateId,
				voterId: body.voterId,
				votedAt: now,
			};
			mockVoteRecords.push(newRecord);

			// totalVotes 증가
			if (vote.totalVotes !== undefined) {
				vote.totalVotes += 1;
			}
		}

		// 선택한 후보의 voteCount 증가
		if (vote.candidates) {
			const candidate = vote.candidates.find((c) => c.id === body.candidateId);
			if (candidate) {
				candidate.voteCount += 1;
			}
		}

		const record = mockVoteRecords.find(
			(r) => r.voteId === body.voteId && r.voterId === body.voterId,
		);
		return HttpResponse.json(record, { status: 201 });
	}),

	// 투표 기록 조회
	http.get("/api/votes/:id/vote-record", ({ params, request }) => {
		const { id } = params;
		const url = new URL(request.url);
		const voterId = url.searchParams.get("voterId");

		if (!voterId) {
			return new HttpResponse(null, { status: 400 });
		}

		const record = mockVoteRecords.find(
			(r) => r.voteId === id && r.voterId === voterId,
		);

		if (!record) {
			return HttpResponse.json(null);
		}

		return HttpResponse.json(record);
	}),
];
