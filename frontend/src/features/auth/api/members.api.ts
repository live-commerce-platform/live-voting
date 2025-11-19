import type { Member } from '../types/member.types'

const API_BASE_URL = '/api/members'

export const fetchMembers = async (): Promise<Member[]> => {
  const response = await fetch(API_BASE_URL)

  if (!response.ok) {
    throw new Error('Failed to fetch members')
  }

  return response.json()
}
