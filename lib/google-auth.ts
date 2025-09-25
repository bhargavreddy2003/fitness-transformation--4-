// Google OAuth configuration and utilities
export interface GoogleUser {
  id: string
  email: string
  name: string
  picture: string
}

export interface AuthUser {
  id: string
  email: string
  name: string
  picture?: string
  role: "admin" | "client"
}

// Admin emails - add your email here to have admin access
const ADMIN_EMAILS = [
  "admin@fitness.com",
  "your-email@gmail.com", // Replace with your actual email
]

import { OTPService } from "./otp-service"

export class GoogleAuthService {
  private static instance: GoogleAuthService
  private gapi: any = null
  private auth2: any = null
  private otpService = OTPService.getInstance()

  static getInstance(): GoogleAuthService {
    if (!GoogleAuthService.instance) {
      GoogleAuthService.instance = new GoogleAuthService()
    }
    return GoogleAuthService.instance
  }

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("Google Auth can only be initialized in browser"))
        return
      }

      // Load Google API script
      if (!document.getElementById("google-api-script")) {
        const script = document.createElement("script")
        script.id = "google-api-script"
        script.src = "https://apis.google.com/js/api.js"
        script.onload = () => {
          window.gapi.load("auth2", () => {
            this.gapi = window.gapi
            this.auth2 = this.gapi.auth2.init({
              client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            })
            resolve()
          })
        }
        script.onerror = reject
        document.head.appendChild(script)
      } else {
        // Already loaded
        this.gapi = window.gapi
        this.auth2 = this.gapi.auth2.getAuthInstance()
        resolve()
      }
    })
  }

  async signIn(): Promise<AuthUser> {
    if (!this.auth2) {
      await this.initialize()
    }

    const googleUser = await this.auth2.signIn()
    const profile = googleUser.getBasicProfile()

    const user: AuthUser = {
      id: profile.getId(),
      email: profile.getEmail(),
      name: profile.getName(),
      picture: profile.getImageUrl(),
      role: ADMIN_EMAILS.includes(profile.getEmail()) ? "admin" : "client",
    }

    // Store in localStorage
    localStorage.setItem("currentUser", JSON.stringify(user))
    localStorage.setItem("googleAuthToken", googleUser.getAuthResponse().access_token)

    return user
  }

  async signInWithOTP(email: string): Promise<{ requiresOTP: boolean; user?: AuthUser }> {
    // Check if email is already verified
    if (this.otpService.isEmailVerified(email)) {
      // Proceed with Google sign-in
      return await this.completeSignIn(email)
    }

    // Send OTP for verification
    const otpResult = await this.otpService.sendOTP(email)
    if (!otpResult.success) {
      throw new Error(otpResult.message)
    }

    return { requiresOTP: true }
  }

  private async completeSignIn(email: string): Promise<{ requiresOTP: boolean; user: AuthUser }> {
    try {
      if (!this.auth2) {
        await this.initialize()
      }

      const googleUser = await this.auth2.signIn()
      const profile = googleUser.getBasicProfile()

      // Verify email matches
      if (profile.getEmail() !== email) {
        throw new Error("Email mismatch. Please sign in with the verified email.")
      }

      const user: AuthUser = {
        id: profile.getId(),
        email: profile.getEmail(),
        name: profile.getName(),
        picture: profile.getImageUrl(),
        role: ADMIN_EMAILS.includes(profile.getEmail()) ? "admin" : "client",
      }

      // Store in localStorage
      localStorage.setItem("currentUser", JSON.stringify(user))
      localStorage.setItem("googleAuthToken", googleUser.getAuthResponse().access_token)

      // Clear OTP data
      this.otpService.clearOTP(email)

      return { requiresOTP: false, user }
    } catch (error) {
      console.error("Sign-in failed:", error)
      throw error
    }
  }

  async signOut(): Promise<void> {
    if (this.auth2) {
      await this.auth2.signOut()
    }
    localStorage.removeItem("currentUser")
    localStorage.removeItem("googleAuthToken")
  }

  getCurrentUser(): AuthUser | null {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem("currentUser")
    return userStr ? JSON.parse(userStr) : null
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser()
    return user?.role === "admin"
  }
}

// Global declaration for Google API
declare global {
  interface Window {
    gapi: any
  }
}
