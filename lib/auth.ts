export interface User {
  id: string
  email: string
  role: "client" | "admin"
  name: string
}

export interface ClientSubmission {
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

export interface ClientTransformation {
  id: string
  name: string
  beforePhoto: string
  afterPhoto: string
  testimonial: string
  rating: number
  transformation: string
  timeframe: string
}

// Mock users for demo
const mockUsers: User[] = [
  { id: "1", email: "admin@fitness.com", role: "admin", name: "Admin User" },
  { id: "2", email: "client@example.com", role: "client", name: "John Doe" },
]

// Mock submissions storage
let mockSubmissions: ClientSubmission[] = [
  {
    id: "1",
    userId: "2",
    name: "John Doe",
    email: "client@example.com",
    phone: "+1234567890",
    goals: "Lose 20 pounds and build muscle",
    experience: "Beginner",
    availability: "Evenings and weekends",
    createdAt: new Date().toISOString(),
    status: "pending",
  },
]

// Mock transformations storage
let mockTransformations: ClientTransformation[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    beforePhoto: "/before-photo-overweight-person-fitness-transformat.jpg",
    afterPhoto: "/after-photo-fit-athletic-person-fitness-transforma.jpg",
    testimonial:
      "Lost 45 pounds in 6 months! The personalized training program was exactly what I needed. My confidence has skyrocketed!",
    rating: 5,
    transformation: "Weight Loss",
    timeframe: "6 months",
  },
  {
    id: "2",
    name: "Mike Chen",
    beforePhoto: "/before-photo-skinny-person-muscle-building-transfo.jpg",
    afterPhoto: "/after-photo-muscular-athletic-person-bodybuilding-.jpg",
    testimonial:
      "Gained 25 pounds of lean muscle! The nutrition and workout plan was perfect for my goals. Highly recommend!",
    rating: 5,
    transformation: "Muscle Building",
    timeframe: "8 months",
  },
  {
    id: "3",
    name: "Emma Davis",
    beforePhoto: "/before-photo-out-of-shape-person-fitness-journey.jpg",
    afterPhoto: "/after-photo-toned-athletic-woman-fitness-transform.jpg",
    testimonial:
      "Complete body transformation! Not just physical but mental too. I feel stronger and more confident than ever.",
    rating: 5,
    transformation: "Body Recomposition",
    timeframe: "10 months",
  },
]

export const authService = {
  login: async (email: string, password: string): Promise<User | null> => {
    // Mock authentication - in production, this would validate against a real database
    const user = mockUsers.find((u) => u.email === email)
    if (user && password === "password") {
      localStorage.setItem("currentUser", JSON.stringify(user))
      return user
    }
    return null
  },

  logout: () => {
    localStorage.removeItem("currentUser")
  },

  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem("currentUser")
    return userStr ? JSON.parse(userStr) : null
  },

  submitClientForm: async (data: Omit<ClientSubmission, "id" | "createdAt" | "status">): Promise<void> => {
    const submission: ClientSubmission = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: "pending",
    }
    mockSubmissions.push(submission)
    localStorage.setItem("submissions", JSON.stringify(mockSubmissions))
  },

  getSubmissions: (): ClientSubmission[] => {
    if (typeof window === "undefined") return mockSubmissions
    const stored = localStorage.getItem("submissions")
    return stored ? JSON.parse(stored) : mockSubmissions
  },

  updateSubmissionStatus: (id: string, status: ClientSubmission["status"]): void => {
    const submissions = authService.getSubmissions()
    const index = submissions.findIndex((s) => s.id === id)
    if (index !== -1) {
      submissions[index].status = status
      localStorage.setItem("submissions", JSON.stringify(submissions))
      mockSubmissions = submissions
    }
  },

  getTransformations: (): ClientTransformation[] => {
    if (typeof window === "undefined") return mockTransformations
    const stored = localStorage.getItem("transformations")
    return stored ? JSON.parse(stored) : mockTransformations
  },

  addTransformation: (transformation: Omit<ClientTransformation, "id">): void => {
    const newTransformation: ClientTransformation = {
      ...transformation,
      id: Date.now().toString(),
    }
    const transformations = authService.getTransformations()
    transformations.push(newTransformation)
    localStorage.setItem("transformations", JSON.stringify(transformations))
    mockTransformations = transformations
  },

  exportToExcel: (): void => {
    const submissions = authService.getSubmissions()
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
  },
}
