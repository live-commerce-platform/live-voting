import { membersHandlers } from "@/features/auth/api/members.mock";
import { voteHandlers } from "@/features/votes/api/votes.mock";

export const handlers = [...voteHandlers, ...membersHandlers];
