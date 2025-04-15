import { NextResponse } from "next/server";
import fs from "fs-extra";
// import poppler from "pdf-poppler";
import path from "path";
import { PDFDocument } from "pdf-lib"; // pdf-lib replaces pdf-poppler
import sharp from "sharp";
import mammoth from "mammoth";
// import { createCanvas, loadImage } from '@napi-rs/canvas';

const DOCS_PATH = path.join(process.cwd(), "public/documents");
const THUMBNAILS_PATH = path.join(process.cwd(), "public/thumbnails");

fs.ensureDirSync(THUMBNAILS_PATH);

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
      // Extract first page as an image
      const pdfBuffer = fs.readFileSync(filePath);
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const page = pdfDoc.getPage(0); // Get the first page

      const pdfBytes = await pdfDoc.save(); // Save the PDF document as bytes
      const pageBuffer = Buffer.from(pdfBytes); // Convert to buffer

      const pngBuffer = await sharp(pageBuffer, { density: 300 }) // Use sharp to render the PDF page
        .resize(300, 400)
        .toBuffer();

      await sharp(pngBuffer).resize(300, 400).toFile(thumbnailPath);
      return NextResponse.json({ thumbnail: publicThumbnail });
    }

    if (ext === ".docx") {
      const result = await mammoth.extractRawText({ path: filePath });
      const firstPageText = result.value.split("\n").slice(0, 10).join("\n");

      const canvas = createCanvas(300, 400);
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, 300, 400);
      ctx.fillStyle = "#000";
      ctx.font = "18px Arial";
      wrapText(ctx as any, firstPageText, 20, 50, 260, 24);

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
function wrapText(ctx: any, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
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
// Import the createCanvas function from '@napi-rs/canvas'
import { createCanvas } from '@napi-rs/canvas';

