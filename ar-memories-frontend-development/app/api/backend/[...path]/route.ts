import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:5000'

type RouteParams = {
  path?: string[]
}

async function proxy(request: NextRequest, params: RouteParams) {
  const path = params.path?.join('/') ?? ''
  const search = request.nextUrl.search
  const targetUrl = `${BACKEND_URL}/${path}${search}`

  const headers = new Headers(request.headers)
  headers.delete('host')
  headers.delete('connection')

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.arrayBuffer(),
    cache: 'no-store',
  })

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  })
}

export async function GET(request: NextRequest, context: { params: Promise<RouteParams> }) {
  return proxy(request, await context.params)
}

export async function POST(request: NextRequest, context: { params: Promise<RouteParams> }) {
  return proxy(request, await context.params)
}

export async function PUT(request: NextRequest, context: { params: Promise<RouteParams> }) {
  return proxy(request, await context.params)
}

export async function PATCH(request: NextRequest, context: { params: Promise<RouteParams> }) {
  return proxy(request, await context.params)
}

export async function DELETE(request: NextRequest, context: { params: Promise<RouteParams> }) {
  return proxy(request, await context.params)
}

export async function OPTIONS(request: NextRequest, context: { params: Promise<RouteParams> }) {
  return proxy(request, await context.params)
}
