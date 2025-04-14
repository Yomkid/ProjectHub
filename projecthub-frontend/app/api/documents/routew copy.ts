import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const documentsDir = path.join(process.cwd(), "public/documents");
    const files = fs.readdirSync(documentsDir);

    const documents = files.map((file) => {
      const ext = path.extname(file).toLowerCase();
      const filename = path.basename(file, ext);

      return {
        id: filename,
        name: filename,
        extension: ext.replace(".", "").toUpperCase(),
        url: `/documents/${file}`,
      };
    });

    return NextResponse.json(documents);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}
