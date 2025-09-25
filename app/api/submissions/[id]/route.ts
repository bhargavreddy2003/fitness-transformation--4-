import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const SUBMISSIONS_FILE = path.join(process.cwd(), "data", "submissions.json")

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json()
    const submissionId = params.id

    // Read existing submissions
    const data = await fs.readFile(SUBMISSIONS_FILE, "utf8")
    const submissions = JSON.parse(data)

    // Find and update submission
    const index = submissions.findIndex((s: any) => s.id === submissionId)
    if (index === -1) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    submissions[index].status = status
    submissions[index].updatedAt = new Date().toISOString()

    // Save updated submissions
    await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2))

    return NextResponse.json(submissions[index])
  } catch (error) {
    console.error("Error updating submission:", error)
    return NextResponse.json({ error: "Failed to update submission" }, { status: 500 })
  }
}
