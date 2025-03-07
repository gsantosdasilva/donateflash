import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { cookies } = request

  if (cookies.get("authenticated")) {
    return NextResponse.json({ authenticated: true })
  } else {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}

