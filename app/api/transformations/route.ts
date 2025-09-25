import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const TRANSFORMATIONS_FILE = path.join(process.cwd(), "data", "transformations.json")

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), "data")
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Get all transformations
export async function GET() {
  try {
    await ensureDataDir()

    try {
      const data = await fs.readFile(TRANSFORMATIONS_FILE, "utf8")
      return NextResponse.json(JSON.parse(data))
    } catch {
      // File doesn't exist, return default transformations
      const defaultTransformations = [
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
      ]
      await fs.writeFile(TRANSFORMATIONS_FILE, JSON.stringify(defaultTransformations, null, 2))
      return NextResponse.json(defaultTransformations)
    }
  } catch (error) {
    console.error("Error reading transformations:", error)
    return NextResponse.json({ error: "Failed to read transformations" }, { status: 500 })
  }
}

// Create new transformation
export async function POST(request: NextRequest) {
  try {
    const transformation = await request.json()
    await ensureDataDir()

    // Read existing transformations
    let transformations = []
    try {
      const data = await fs.readFile(TRANSFORMATIONS_FILE, "utf8")
      transformations = JSON.parse(data)
    } catch {
      // File doesn't exist, start with empty array
    }

    // Add new transformation
    const newTransformation = {
      ...transformation,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    transformations.push(newTransformation)

    // Save to file
    await fs.writeFile(TRANSFORMATIONS_FILE, JSON.stringify(transformations, null, 2))

    return NextResponse.json(newTransformation)
  } catch (error) {
    console.error("Error creating transformation:", error)
    return NextResponse.json({ error: "Failed to create transformation" }, { status: 500 })
  }
}
