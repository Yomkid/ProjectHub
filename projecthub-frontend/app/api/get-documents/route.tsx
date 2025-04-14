import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DOCS_PATH = path.join(process.cwd(), "public/documents");

export async function GET() {
  try {
    // Read documents directory
    const files = fs.readdirSync(DOCS_PATH)
      .filter(file => [".pdf", ".docx", ".txt"].includes(path.extname(file).toLowerCase()))
      .map(file => ({
        name: file,
        type: path.extname(file).toLowerCase().replace(".", ""),
        url: `/documents/${file}`
      }));

    return NextResponse.json(files);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read documents" },
      { status: 500 }
    );
  }
}