import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    // Verify Google token
    const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`)
    const tokenInfo = await response.json()

    if (tokenInfo.error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Get user info from Google
    const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`)
    const userInfo = await userResponse.json()

    // Check if user is admin
    const adminEmails = ["admin@fitness.com", "your-email@gmail.com"] // Replace with your email
    const isAdmin = adminEmails.includes(userInfo.email)

    const user = {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      role: isAdmin ? "admin" : "client",
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
