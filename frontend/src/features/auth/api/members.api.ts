import { apiClient } from "@/shared/lib/api";
import type { Member } from "../types/member.types";

export const fetchMembers = async (): Promise<Member[]> => {
	return apiClient.get("api/members").json<Member[]>();
};
