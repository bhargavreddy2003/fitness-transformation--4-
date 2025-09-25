// OTP Service for email verification
export interface OTPData {
  email: string
  otp: string
  expiresAt: number
  verified: boolean
}

export class OTPService {
  private static instance: OTPService
  private otpStorage: Map<string, OTPData> = new Map()

  static getInstance(): OTPService {
    if (!OTPService.instance) {
      OTPService.instance = new OTPService()
    }
    return OTPService.instance
  }

  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  async sendOTP(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const otp = this.generateOTP()
      const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

      // Store OTP
      this.otpStorage.set(email, {
        email,
        otp,
        expiresAt,
        verified: false,
      })

      // In a real app, you would send this via email service
      // For demo purposes, we'll log it to console
      console.log(`[OTP] Email: ${email}, OTP: ${otp}`)

      // Simulate email sending
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return {
        success: true,
        message: `OTP sent to ${email}. Check console for demo OTP.`,
      }
    } catch (error) {
      console.error("Failed to send OTP:", error)
      return {
        success: false,
        message: "Failed to send OTP. Please try again.",
      }
    }
  }

  verifyOTP(email: string, inputOTP: string): { success: boolean; message: string } {
    const otpData = this.otpStorage.get(email)

    if (!otpData) {
      return {
        success: false,
        message: "No OTP found for this email. Please request a new one.",
      }
    }

    if (Date.now() > otpData.expiresAt) {
      this.otpStorage.delete(email)
      return {
        success: false,
        message: "OTP has expired. Please request a new one.",
      }
    }

    if (otpData.otp !== inputOTP) {
      return {
        success: false,
        message: "Invalid OTP. Please check and try again.",
      }
    }

    // Mark as verified
    otpData.verified = true
    this.otpStorage.set(email, otpData)

    return {
      success: true,
      message: "OTP verified successfully!",
    }
  }

  isEmailVerified(email: string): boolean {
    const otpData = this.otpStorage.get(email)
    return otpData?.verified || false
  }

  clearOTP(email: string): void {
    this.otpStorage.delete(email)
  }
}
