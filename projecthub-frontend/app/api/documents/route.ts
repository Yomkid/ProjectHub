import { NextResponse } from "next/server";
import fs from "fs-extra";
import path from "path";
import mammoth from "mammoth";

const DOCS_PATH = path.join(process.cwd(), "public/documents");
const SUPPORTED_EXTENSIONS = [".pdf", ".docx", ".txt"];

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const filename = url.searchParams.get("file");

    if (filename) {
      return handleFilePreview(filename);
    }
    
    return handleDocumentList();
  } catch (error) {
    console.error("Error in documents API:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

async function handleFilePreview(filename: string) {
  const filePath = path.join(DOCS_PATH, filename);
  const ext = path.extname(filename).toLowerCase();
  
  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: "File not found" }, 
      { status: 404 }
    );
  }

  // For all files including PDFs, just return the file info
  // Let the frontend handle the actual preview rendering
  const fileInfo = {
    name: filename,
    type: ext.replace(".", ""),
    url: `/documents/${encodeURIComponent(filename)}`,
    size: fs.statSync(filePath).size
  };

  // For text files, include a preview
  if ([".docx", ".txt"].includes(ext)) {
    const previewText = await generateTextPreview(filePath, ext);
    return NextResponse.json({ 
      ...fileInfo,
      preview: previewText 
    });
  }

  return NextResponse.json(fileInfo);
}

async function handleDocumentList() {
  const files = fs.readdirSync(DOCS_PATH)
    .filter(file => SUPPORTED_EXTENSIONS.includes(path.extname(file).toLowerCase()))
    .map((file, index) => ({
      id: index + 1,
      name: file,
      type: path.extname(file).toLowerCase().replace(".", ""),
      url: `/documents/${encodeURIComponent(file)}`,
      size: fs.statSync(path.join(DOCS_PATH, file)).size
    }));

  return NextResponse.json(files);
}

async function generateTextPreview(filePath: string, type: string): Promise<string> {
  if (type === ".docx") {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value.split("\n").slice(0, 10).join("\n");
  }
  
  return fs.readFileSync(filePath, "utf8")
    .split("\n")
    .slice(0, 10)
    .join("\n");
}