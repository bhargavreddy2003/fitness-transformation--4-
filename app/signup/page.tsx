"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GoogleAuthService } from "@/lib/google-auth"
import { OTPVerification } from "@/components/otp-verification"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Dumbbell, AlertCircle, Mail } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [step, setStep] = useState<"email" | "otp" | "google">("email")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const googleAuth = GoogleAuthService.getInstance()

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address")
        return
      }

      // Send OTP
      const response = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (result.success) {
        setStep("otp")
      } else {
        setError(result.message || "Failed to send OTP")
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOTPVerified = async () => {
    try {
      setLoading(true)
      await googleAuth.initialize()

      // Complete Google sign-in after OTP verification
      const result = await googleAuth.signInWithOTP(email)

      if (result.user) {
        // Redirect based on role
        if (result.user.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/")
        }
      } else {
        setStep("google")
      }
    } catch (err) {
      setError("Sign-up failed. Please try again.")
      setStep("email")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      const user = await googleAuth.signIn()

      // Redirect based on role
      if (user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/")
      }
    } catch (err) {
      setError("Google sign-in failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setStep("email")
    setEmail("")
    setError("")
  }

  if (step === "otp") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <OTPVerification email={email} onVerified={handleOTPVerified} onCancel={handleCancel} />
      </div>
    )
  }

  if (step === "google") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Dumbbell className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Complete Your Sign-Up</CardTitle>
            <CardDescription>Email verified! Now sign in with Google to complete your account setup.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button onClick={handleGoogleSignIn} className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Continue with Google"}
            </Button>

            <Button variant="outline" onClick={handleCancel} className="w-full bg-transparent">
              Back to Email
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-foreground">
            <Dumbbell className="h-8 w-8 text-primary" />
            FitTransform
          </Link>
        </div>

        <Card className="bg-card border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-card-foreground">Create Account</CardTitle>
            <CardDescription>Sign up with email verification and Google authentication</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-card-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="bg-input border-border text-foreground"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Mail className="h-4 w-4 mr-2 animate-pulse" />
                    Sending OTP...
                  </>
                ) : (
                  "Send Verification Code"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>We'll send a 6-digit code to verify your email</p>
            </div>

            <div className="mt-4 text-center">
              <span className="text-sm text-muted-foreground">Already have an account? </span>
              <Link href="/login" className="text-sm text-primary hover:underline">
                Sign In
              </Link>
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-primary hover:underline">
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
