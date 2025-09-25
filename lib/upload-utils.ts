// Utility functions for file uploads and management

export interface UploadedFile {
  url: string
  filename: string
  size: number
  type: string
  uploadedAt: string
}

export class UploadService {
  static async uploadFile(file: File, type: "client" | "trainer"): Promise<string> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", type)

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Upload failed")
    }

    const { url } = await response.json()
    return url
  }

  static validateFile(file: File, maxSize = 5): string | null {
    // Check file type
    if (!file.type.startsWith("image/")) {
      return "Please select an image file"
    }

    // Check file size (in MB)
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }

    return null
  }

  static getFileExtension(filename: string): string {
    return filename.split(".").pop()?.toLowerCase() || ""
  }

  static generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now()
    const extension = this.getFileExtension(originalName)
    return `${timestamp}.${extension}`
  }

  static isValidImageType(type: string): boolean {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    return validTypes.includes(type.toLowerCase())
  }
}

// Hook for managing multiple file uploads
export function useFileUpload() {
  const uploadFile = async (file: File, type: "client" | "trainer"): Promise<string> => {
    const validation = UploadService.validateFile(file)
    if (validation) {
      throw new Error(validation)
    }

    return await UploadService.uploadFile(file, type)
  }

  return { uploadFile }
}
