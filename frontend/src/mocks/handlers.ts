import { voteHandlers } from '@/features/votes/api/votes.mock'
import { membersHandlers } from '@/features/auth/api/members.mock'

export const handlers = [...voteHandlers, ...membersHandlers]
