"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Dumbbell, Users, Trophy, Target, Star, Quote, Award, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [transformations, setTransformations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTransformations()
  }, [])

  const loadTransformations = async () => {
    try {
      const response = await fetch("/api/transformations")
      if (response.ok) {
        const data = await response.json()
        setTransformations(data)
      }
    } catch (error) {
      console.error("Failed to load transformations:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Your Name - Personal Trainer</h1>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/client-form">Work With Me</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative py-32 px-4 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/professional-personal-trainer-in-modern-gym-with-d.jpg"
            alt="Personal trainer background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        {/* Content Overlay */}
        <div className="relative container mx-auto text-center max-w-4xl text-white">
          <h2 className="text-6xl font-bold mb-6 text-balance">
            Transform Your Body,
            <br />
            Transform Your Life
          </h2>
          <p className="text-xl mb-8 text-pretty opacity-90">
            I'm [Your Name], a certified personal trainer with 8+ years of experience helping people achieve their
            fitness goals. Let me guide you on your transformation journey with personalized training and nutrition
            plans.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" asChild>
              <Link href="/client-form">Start Your Journey</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              asChild
            >
              <Link href="#transformations">See Results</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-card-foreground mb-4">My Personal Records</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Leading by example - here are some of my personal achievements that demonstrate my commitment to fitness.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-background border-border text-center">
              <CardHeader>
                <Trophy className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-3xl font-bold text-primary">405 lbs</CardTitle>
                <CardDescription>Deadlift PR</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-background border-border text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-3xl font-bold text-primary">315 lbs</CardTitle>
                <CardDescription>Bench Press PR</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-background border-border text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-3xl font-bold text-primary">365 lbs</CardTitle>
                <CardDescription>Squat PR</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-background border-border text-center">
              <CardHeader>
                <Target className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-3xl font-bold text-primary">6:30</CardTitle>
                <CardDescription>Mile Time</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section id="transformations" className="py-16 px-4 overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Client Transformations</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real results from real people. See the incredible transformations my clients have achieved.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : transformations.length > 0 ? (
            <div className="relative">
              <div className="flex animate-scroll-left gap-8 w-max">
                {[...transformations, ...transformations].map((transformation, index) => (
                  <Card
                    key={`${transformation.id}-${index}`}
                    className="bg-card border-border overflow-hidden flex-shrink-0 w-80"
                  >
                    <div className="grid grid-cols-2 h-64">
                      <div className="relative">
                        <img
                          src={
                            transformation.beforePhoto ||
                            "/placeholder.svg?height=256&width=160&query=before transformation"
                          }
                          alt={`${transformation.name} - Before`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
                          BEFORE
                        </div>
                      </div>
                      <div className="relative">
                        <img
                          src={
                            transformation.afterPhoto ||
                            "/placeholder.svg?height=256&width=160&query=after transformation"
                          }
                          alt={`${transformation.name} - After`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 text-xs rounded">
                          AFTER
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h4 className="text-xl font-bold text-card-foreground mb-2">{transformation.name}</h4>
                      <p className="text-primary font-semibold mb-3">
                        {transformation.transformation} {transformation.timeframe && `in ${transformation.timeframe}`}
                      </p>
                      <Quote className="h-6 w-6 text-primary mb-2" />
                      <p className="text-muted-foreground text-sm mb-4">{transformation.testimonial}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(transformation.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No transformations available yet.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-background border-border">
              <CardHeader>
                <Target className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-foreground">Personalized Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Every program is tailored specifically to your goals, lifestyle, and fitness level.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-background border-border">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-foreground">1-on-1 Coaching</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Direct access to me for guidance, motivation, and adjustments to your program.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-background border-border">
              <CardHeader>
                <Trophy className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-foreground">Proven Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Science-based training and nutrition strategies that deliver real, lasting results.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-background border-border">
              <CardHeader>
                <Dumbbell className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-foreground">Ongoing Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Continuous guidance, progress tracking, and motivation throughout your journey.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h3 className="text-3xl font-bold text-foreground mb-4">Ready to Start Your Transformation?</h3>
          <p className="text-lg text-muted-foreground mb-8">
            Join the hundreds of clients who have transformed their lives. Fill out the application form and let's begin
            your journey to a stronger, healthier you.
          </p>
          <Button size="lg" asChild>
            <Link href="/client-form">Apply to Work With Me</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">© 2025 [Your Name] Personal Training. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
