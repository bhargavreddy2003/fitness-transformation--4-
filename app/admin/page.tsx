"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { FileUpload } from "@/components/file-upload"
import { GoogleAuthService, type AuthUser } from "@/lib/google-auth"
import { Users, Clock, CheckCircle, XCircle, Download, Plus, LogOut, ExternalLink, Star } from "lucide-react"

interface ClientSubmission {
  id: string
  userId: string
  name: string
  email: string
  phone: string
  goals: string
  experience: string
  availability: string
  beforePhoto?: string
  afterPhoto?: string
  createdAt: string
  status: "pending" | "approved" | "rejected"
}

interface ClientTransformation {
  id: string
  name: string
  beforePhoto: string
  afterPhoto: string
  testimonial: string
  rating: number
  transformation: string
  timeframe: string
}

export default function AdminDashboard() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [submissions, setSubmissions] = useState<ClientSubmission[]>([])
  const [isAddingClient, setIsAddingClient] = useState(false)
  const [newTransformation, setNewTransformation] = useState({
    name: "",
    transformation: "",
    timeframe: "",
    testimonial: "",
    rating: 5,
    beforePhoto: "",
    afterPhoto: "",
  })

  const googleAuth = GoogleAuthService.getInstance()

  useEffect(() => {
    checkAuth()
    if (googleAuth.isAuthenticated() && googleAuth.isAdmin()) {
      loadSubmissions()
    }
  }, [])

  const checkAuth = async () => {
    try {
      await googleAuth.initialize()
      const currentUser = googleAuth.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error("Auth initialization failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      const user = await googleAuth.signIn()

      if (user.role !== "admin") {
        await googleAuth.signOut()
        alert("Access denied. Admin privileges required.")
        return
      }

      setUser(user)
      await loadSubmissions()
    } catch (error) {
      console.error("Login failed:", error)
      alert("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await googleAuth.signOut()
      setUser(null)
      setSubmissions([])
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const loadSubmissions = async () => {
    try {
      const response = await fetch("/api/submissions")
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data)
      }
    } catch (error) {
      console.error("Failed to load submissions:", error)
    }
  }

  const handleStatusUpdate = async (id: string, status: "approved" | "rejected") => {
    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setSubmissions((prev) => prev.map((sub) => (sub.id === id ? { ...sub, status } : sub)))
      }
    } catch (error) {
      console.error("Failed to update status:", error)
      alert("Failed to update status. Please try again.")
    }
  }

  const handleExportToExcel = () => {
    const csvContent = [
      ["Name", "Email", "Phone", "Goals", "Experience", "Availability", "Status", "Submitted Date"],
      ...submissions.map((sub) => [
        sub.name,
        sub.email,
        sub.phone,
        sub.goals,
        sub.experience,
        sub.availability,
        sub.status,
        new Date(sub.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `client-submissions-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleAddTransformation = async () => {
    console.log("[v0] Add transformation clicked, validating data:", newTransformation)

    if (!newTransformation.name || !newTransformation.transformation || !newTransformation.testimonial) {
      alert("Please fill in all required fields (Name, Transformation Type, and Testimonial)")
      return
    }

    try {
      console.log("[v0] Sending transformation data to API:", newTransformation)

      const response = await fetch("/api/transformations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransformation),
      })

      console.log("[v0] API response status:", response.status)

      if (response.ok) {
        const result = await response.json()
        console.log("[v0] Transformation added successfully:", result)

        // Reset form
        setNewTransformation({
          name: "",
          transformation: "",
          timeframe: "",
          testimonial: "",
          rating: 5,
          beforePhoto: "",
          afterPhoto: "",
        })
        setIsAddingClient(false)
        alert("Client transformation added successfully!")
      } else {
        const errorData = await response.json()
        console.error("[v0] API error:", errorData)
        alert(`Failed to add transformation: ${errorData.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("[v0] Failed to add transformation:", error)
      alert("Failed to add transformation. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">Admin Login Required</CardTitle>
            <CardDescription>You need to be logged in as an admin to access this page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleGoogleLogin} className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in with Google"}
            </Button>
            <div className="text-center">
              <Link href="/login" className="text-sm text-muted-foreground hover:text-primary">
                Go to Login Page
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = {
    total: submissions.length,
    pending: submissions.filter((s) => s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded flex items-center justify-center">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-primary">FitTransform Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Site
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <img src={user.picture || "/placeholder.svg"} alt={user.name} className="h-8 w-8 rounded-full" />
              <span className="text-sm font-medium">{user.name}</span>
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
          <p className="text-muted-foreground">Manage client applications and track submissions.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button onClick={handleExportToExcel} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export to Excel
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsAddingClient(!isAddingClient)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Client Transformation
          </Button>
        </div>

        {/* Add Client Form */}
        {isAddingClient && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Client Transformation</CardTitle>
              <CardDescription>Add a client success story to showcase on the homepage carousel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Input
                    id="clientName"
                    placeholder="e.g., Sarah M."
                    value={newTransformation.name}
                    onChange={(e) => setNewTransformation((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="timeframe">Timeframe</Label>
                  <Input
                    id="timeframe"
                    placeholder="e.g., 6 months"
                    value={newTransformation.timeframe}
                    onChange={(e) => setNewTransformation((prev) => ({ ...prev, timeframe: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="transformation">Transformation Type *</Label>
                <Input
                  id="transformation"
                  placeholder="e.g., Lost 35 lbs, Gained 25 lbs muscle"
                  value={newTransformation.transformation}
                  onChange={(e) => setNewTransformation((prev) => ({ ...prev, transformation: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="testimonial">Testimonial *</Label>
                <Textarea
                  id="testimonial"
                  placeholder="Client's testimonial about their transformation..."
                  rows={3}
                  value={newTransformation.testimonial}
                  onChange={(e) => setNewTransformation((prev) => ({ ...prev, testimonial: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="rating">Rating</Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewTransformation((prev) => ({ ...prev, rating: star }))}
                      className={`p-1 ${star <= newTransformation.rating ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      <Star className="h-5 w-5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Before Photo</Label>
                  <FileUpload
                    type="client"
                    onUpload={(url) => {
                      console.log("[v0] Before photo uploaded:", url)
                      setNewTransformation((prev) => ({ ...prev, beforePhoto: url }))
                    }}
                    currentImage={newTransformation.beforePhoto}
                  />
                </div>
                <div>
                  <Label>After Photo</Label>
                  <FileUpload
                    type="client"
                    onUpload={(url) => {
                      console.log("[v0] After photo uploaded:", url)
                      setNewTransformation((prev) => ({ ...prev, afterPhoto: url }))
                    }}
                    currentImage={newTransformation.afterPhoto}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddingClient(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTransformation}>Add Client</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All time submissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">Active clients</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{stats.rejected}</div>
              <p className="text-xs text-muted-foreground">Not approved</p>
            </CardContent>
          </Card>
        </div>

        {/* Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Client Applications</CardTitle>
            <CardDescription>Review and manage client submissions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">Experience</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Submitted</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="border-b">
                      <td className="py-3 px-4 font-medium">{submission.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{submission.email}</td>
                      <td className="py-3 px-4 text-muted-foreground capitalize">{submission.experience}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            submission.status === "pending"
                              ? "secondary"
                              : submission.status === "approved"
                                ? "default"
                                : "destructive"
                          }
                        >
                          {submission.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {submission.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleStatusUpdate(submission.id, "approved")}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleStatusUpdate(submission.id, "rejected")}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
