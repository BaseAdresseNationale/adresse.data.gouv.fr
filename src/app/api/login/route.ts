import { getAuthorizationControllerFactory } from '@/utils/oauth'

export const dynamic = 'force-dynamic'

export async function POST() {
  return getAuthorizationControllerFactory()
}
