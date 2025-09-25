import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const SUBMISSIONS_FILE = path.join(process.cwd(), "data", "submissions.json")

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), "data")
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Get all submissions
export async function GET() {
  try {
    await ensureDataDir()

    try {
      const data = await fs.readFile(SUBMISSIONS_FILE, "utf8")
      return NextResponse.json(JSON.parse(data))
    } catch {
      // File doesn't exist, return empty array
      return NextResponse.json([])
    }
  } catch (error) {
    console.error("Error reading submissions:", error)
    return NextResponse.json({ error: "Failed to read submissions" }, { status: 500 })
  }
}

// Create new submission
export async function POST(request: NextRequest) {
  try {
    const submission = await request.json()
    await ensureDataDir()

    // Read existing submissions
    let submissions = []
    try {
      const data = await fs.readFile(SUBMISSIONS_FILE, "utf8")
      submissions = JSON.parse(data)
    } catch {
      // File doesn't exist, start with empty array
    }

    // Add new submission
    const newSubmission = {
      ...submission,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: "pending",
    }

    submissions.push(newSubmission)

    // Save to file
    await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2))

    return NextResponse.json(newSubmission)
  } catch (error) {
    console.error("Error creating submission:", error)
    return NextResponse.json({ error: "Failed to create submission" }, { status: 500 })
  }
}
