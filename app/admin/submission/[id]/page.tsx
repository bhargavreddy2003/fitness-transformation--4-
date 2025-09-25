"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { authService, type ClientSubmission } from "@/lib/auth"
import { Dumbbell, ArrowLeft, Phone, Mail, Target, Clock, User } from "lucide-react"
import Link from "next/link"

export default function SubmissionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [submission, setSubmission] = useState<ClientSubmission | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const submissions = authService.getSubmissions()
    const found = submissions.find((s) => s.id === params.id)
    setSubmission(found || null)
    setLoading(false)
  }, [params.id])

  const handleStatusUpdate = (status: ClientSubmission["status"]) => {
    if (submission) {
      authService.updateSubmissionStatus(submission.id, status)
      setSubmission({ ...submission, status })
    }
  }

  const getStatusBadge = (status: ClientSubmission["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30">
            Rejected
          </Badge>
        )
    }
  }

  if (loading) {
    return (
      <AuthGuard requiredRole="admin">
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading submission...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (!submission) {
    return (
      <AuthGuard requiredRole="admin">
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="w-full max-w-md bg-card border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-card-foreground">Submission Not Found</CardTitle>
              <CardDescription>The requested submission could not be found.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild>
                <Link href="/admin">Back to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">FitTransform Admin</h1>
            </div>
            <UserNav />
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="outline" asChild className="mb-4 bg-transparent">
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Client Application</h2>
                <p className="text-muted-foreground">Review detailed submission information</p>
              </div>
              <div className="flex items-center gap-4">
                {getStatusBadge(submission.status)}
                {submission.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleStatusUpdate("approved")}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Approve
                    </Button>
                    <Button variant="destructive" onClick={() => handleStatusUpdate("rejected")}>
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-card-foreground font-medium">{submission.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Email Address
                  </label>
                  <p className="text-card-foreground">{submission.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Phone Number
                  </label>
                  <p className="text-card-foreground">{submission.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Experience Level</label>
                  <p className="text-card-foreground capitalize">{submission.experience}</p>
                </div>
              </CardContent>
            </Card>

            {/* Fitness Information */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Fitness Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fitness Goals</label>
                  <p className="text-card-foreground">{submission.goals}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Availability
                  </label>
                  <p className="text-card-foreground">{submission.availability}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Submitted</label>
                  <p className="text-card-foreground">
                    {new Date(submission.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Photos */}
            {(submission.beforePhoto || submission.afterPhoto) && (
              <Card className="bg-card border-border lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Progress Photos</CardTitle>
                  <CardDescription>Client submitted transformation photos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {submission.beforePhoto && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Before Photo</label>
                        <div className="mt-2 p-4 border border-border rounded-lg bg-muted/20">
                          <p className="text-card-foreground">{submission.beforePhoto}</p>
                          <p className="text-xs text-muted-foreground mt-1">File uploaded</p>
                        </div>
                      </div>
                    )}
                    {submission.afterPhoto && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">After Photo</label>
                        <div className="mt-2 p-4 border border-border rounded-lg bg-muted/20">
                          <p className="text-card-foreground">{submission.afterPhoto}</p>
                          <p className="text-xs text-muted-foreground mt-1">File uploaded</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
