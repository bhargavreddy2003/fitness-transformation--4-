"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OTPService } from "@/lib/otp-service"
import { Mail, RefreshCw } from "lucide-react"

interface OTPVerificationProps {
  email: string
  onVerified: () => void
  onCancel: () => void
}

export function OTPVerification({ email, onVerified, onCancel }: OTPVerificationProps) {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [message, setMessage] = useState("")
  const [countdown, setCountdown] = useState(0)

  const otpService = OTPService.getInstance()

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setMessage("Please enter a valid 6-digit OTP")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const result = otpService.verifyOTP(email, otp)

      if (result.success) {
        setMessage("Email verified successfully!")
        setTimeout(() => {
          onVerified()
        }, 1000)
      } else {
        setMessage(result.message)
      }
    } catch (error) {
      setMessage("Verification failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (countdown > 0) return

    setResending(true)
    setMessage("")

    try {
      const result = await otpService.sendOTP(email)
      setMessage(result.message)

      if (result.success) {
        // Start countdown
        setCountdown(60)
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
    } catch (error) {
      setMessage("Failed to resend OTP. Please try again.")
    } finally {
      setResending(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          We've sent a 6-digit verification code to
          <br />
          <strong>{email}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="otp">Enter OTP</Label>
          <Input
            id="otp"
            type="text"
            placeholder="000000"
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6)
              setOtp(value)
            }}
            maxLength={6}
            className="text-center text-lg tracking-widest"
          />
        </div>

        {message && (
          <div className={`text-sm text-center ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </div>
        )}

        <div className="space-y-2">
          <Button onClick={handleVerifyOTP} className="w-full" disabled={loading || otp.length !== 6}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Didn't receive the code?</span>
            <Button
              variant="link"
              size="sm"
              onClick={handleResendOTP}
              disabled={resending || countdown > 0}
              className="p-0 h-auto"
            >
              {resending ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Sending...
                </>
              ) : countdown > 0 ? (
                `Resend in ${countdown}s`
              ) : (
                "Resend OTP"
              )}
            </Button>
          </div>
        </div>

        <Button variant="outline" onClick={onCancel} className="w-full bg-transparent">
          Cancel
        </Button>
      </CardContent>
    </Card>
  )
}
