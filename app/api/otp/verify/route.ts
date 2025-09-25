import { type NextRequest, NextResponse } from "next/server"
import { OTPService } from "@/lib/otp-service"

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 })
    }

    const otpService = OTPService.getInstance()
    const result = otpService.verifyOTP(email, otp)

    return NextResponse.json(result)
  } catch (error) {
    console.error("OTP verification error:", error)
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 })
  }
}
