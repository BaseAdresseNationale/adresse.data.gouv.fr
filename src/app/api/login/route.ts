import { getAuthorizationControllerFactory } from '@/utils/oauth'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  return getAuthorizationControllerFactory(req)
}
