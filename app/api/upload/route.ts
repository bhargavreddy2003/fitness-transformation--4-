import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string // "client" or "trainer"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Create upload directories
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    const clientDir = path.join(uploadDir, "clients")
    const trainerDir = path.join(uploadDir, "trainers")

    await fs.mkdir(clientDir, { recursive: true })
    await fs.mkdir(trainerDir, { recursive: true })

    // Determine target directory
    const targetDir = type === "trainer" ? trainerDir : clientDir

    // Generate unique filename
    const timestamp = Date.now()
    const extension = path.extname(file.name)
    const filename = `${timestamp}${extension}`
    const filepath = path.join(targetDir, filename)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await fs.writeFile(filepath, buffer)

    // Return public URL
    const publicUrl = `/uploads/${type === "trainer" ? "trainers" : "clients"}/${filename}`

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
