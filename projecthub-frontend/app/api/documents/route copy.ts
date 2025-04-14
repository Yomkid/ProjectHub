import { NextResponse } from "next/server";
import fs from "fs/promises"; // Use async/await for file operations
import path from "path";
import pdf from "pdf-poppler"; // For PDF processing

export async function GET(req: Request) {
  try {
    // Get document name from query parameters
    const url = new URL(req.url);
    const filename = url.searchParams.get("file");
    
    if (!filename) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const documentsDir = path.join(process.cwd(), "public/documents");
    const filePath = path.join(documentsDir, filename);

    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const ext = path.extname(filename).toLowerCase();
    let thumbnailPath = `/icons/default.png`; // Default icon

    // Determine thumbnail path
    const thumbnailFilename = `${filename}.png`;
    const thumbnailFullPath = path.join(documentsDir, thumbnailFilename);

    if (ext === ".pdf") {
      try {
        await fs.access(thumbnailFullPath); // Check if thumbnail already exists
      } catch {
        const options = {
          format: "png",
          out_dir: documentsDir,
          out_prefix: filename.replace(".pdf", ""),
          page: 1,
        };
        await pdf.convert(filePath, options);
      }
      thumbnailPath = `/documents/${thumbnailFilename}`;
    } else if (ext === ".docx") {
      thumbnailPath = "/icons/docx.png";
    } else if (ext === ".txt") {
      thumbnailPath = "/icons/txt.png";
    }

    return NextResponse.json({ thumbnail: thumbnailPath });
  } catch (error) {
    console.error("Thumbnail generation error:", error);
    return NextResponse.json({ error: "Error generating thumbnail" }, { status: 500 });
  }
}
