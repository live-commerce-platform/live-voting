import { HttpResponse, http } from "msw";
import type { Member } from "../types/member.types";

// Mock 멤버 데이터
export const mockMembers: Member[] = [
	{
		id: "1",
		name: "김철수",
	},
	{
		id: "2",
		name: "이영희",
	},
	{
		id: "3",
		name: "박지훈",
	},
	{
		id: "4",
		name: "최민지",
	},
	{
		id: "5",
		name: "정다은",
	},
	{
		id: "6",
		name: "강호진",
	},
	{
		id: "7",
		name: "윤서연",
	},
];

export const membersHandlers = [
	// 멤버 목록 조회
	http.get("/api/members", () => {
		return HttpResponse.json(mockMembers);
	}),
];
