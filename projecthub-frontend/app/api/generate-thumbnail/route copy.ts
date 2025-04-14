import { NextResponse } from "next/server";
import fs from "fs-extra";
import path from "path";
import pdfPoppler from "pdf-poppler";
import sharp from "sharp";
import puppeteer from "puppeteer";
import mammoth from "mammoth";
import { createCanvas } from "canvas";

const DOCS_PATH = path.join(process.cwd(), "public/documents");
const THUMBNAILS_PATH = path.join(process.cwd(), "public/thumbnails"); // Ensure absolute path

fs.ensureDirSync(THUMBNAILS_PATH); // Ensure the thumbnails directory exists

export async function GET(req: Request) {
  const url = new URL(req.url);
  const filename = url.searchParams.get("file");

  if (!filename) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const filePath = path.join(DOCS_PATH, filename);
  const ext = path.extname(filename).toLowerCase();
  const thumbnailPath = path.join(THUMBNAILS_PATH, `${filename}.jpg`);
  const publicThumbnail = `/thumbnails/${filename}.jpg`;

  if (!fs.existsSync(filePath)) return NextResponse.json({ error: "File not found" }, { status: 404 });

  // Return existing thumbnail if available
  if (fs.existsSync(thumbnailPath)) return NextResponse.json({ thumbnail: publicThumbnail });

  try {
    if (ext === ".pdf") {
      await pdfPoppler.convert(filePath, {
        format: "jpeg",
        out_dir: THUMBNAILS_PATH,
        out_prefix: filename,
        page: 1,
      });

      await sharp(`${THUMBNAILS_PATH}/${filename}-1.jpg`).resize(300, 400).toFile(thumbnailPath);
      return NextResponse.json({ thumbnail: publicThumbnail });
    }

    if (ext === ".docx") {
      const result = await mammoth.extractRawText({ path: filePath });
      const firstPageText = result.value.split("\n").slice(0, 10).join("\n");

      // Convert text to image using Canvas (instead of Puppeteer)
      const canvas = createCanvas(300, 400);
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, 300, 400);
      ctx.fillStyle = "#000";
      ctx.font = "18px Arial";
      
      wrapText(ctx, firstPageText, 20, 50, 260, 24); // Proper text wrapping

      const buffer = canvas.toBuffer("image/jpeg");
      fs.writeFileSync(thumbnailPath, buffer);

      return NextResponse.json({ thumbnail: publicThumbnail });
    }

    if (ext === ".txt") {
      const content = fs.readFileSync(filePath, "utf8").split("\n").slice(0, 10).join("\n");

      const canvas = createCanvas(300, 400);
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, 300, 400);
      ctx.fillStyle = "#000";
      ctx.font = "18px Arial";

      wrapText(ctx, content, 20, 50, 260, 24);

      const buffer = canvas.toBuffer("image/jpeg");
      fs.writeFileSync(thumbnailPath, buffer);

      return NextResponse.json({ thumbnail: publicThumbnail });
    }

    return NextResponse.json({ thumbnail: "/icons/default.png" });
  } catch (error) {
    console.error("Error generating preview:", error);
    return NextResponse.json({ error: "Failed to generate preview" }, { status: 500 });
  }
}

// Helper function for text wrapping
function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const words = text.split(" ");
    let line = "";
    for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + " ";
        let metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
            ctx.fillText(line, x, y);
            line = words[i] + " ";
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}
