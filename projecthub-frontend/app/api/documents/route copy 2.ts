import { NextResponse } from "next/server";
import fs from "fs-extra";
import path from "path";
import { createCanvas } from "canvas"; // Use Node.js canvas
import { getDocument } from "pdfjs-dist";
import mammoth from "mammoth";

const DOCS_PATH = path.join(process.cwd(), "public/documents");
const THUMBNAILS_PATH = path.join(process.cwd(), "public/thumbnails");

fs.ensureDirSync(THUMBNAILS_PATH); // Ensure directory exists

// export async function GET(req: Request) {
//   try {
//     const url = new URL(req.url);
//     const filename = url.searchParams.get("file");
//     if (!filename) return NextResponse.json({ error: "No file provided" }, { status: 400 });

//     const filePath = path.join(DOCS_PATH, filename);
//     const ext = path.extname(filename).toLowerCase();
//     const thumbnailPath = path.join(THUMBNAILS_PATH, `${filename}.png`);
//     const publicThumbnail = `/thumbnails/${filename}.png`;

//     if (!fs.existsSync(filePath)) {
//       return NextResponse.json({ error: "File not found" }, { status: 404 });
//     }

//     if (fs.existsSync(thumbnailPath)) {
//       return NextResponse.json({ thumbnail: publicThumbnail });
//     }

//     if (ext === ".pdf") {
//       await generatePDFThumbnail(filePath, thumbnailPath);
//       return NextResponse.json({ thumbnail: publicThumbnail });
//     }

//     if (ext === ".docx" || ext === ".txt") {
//       const previewText = await generateTextPreview(filePath, ext);
//       return NextResponse.json({ preview: previewText });
//     }

//     return NextResponse.json({ thumbnail: "/icons/default.png" });

//   } catch (error) {
//     console.error("❌ Error generating preview:", error);
//     return NextResponse.json({ error: "Failed to generate preview" }, { status: 500 });
//   }
// }


// export async function GET() {
//   try {
//     // Get all files in the directory
//     const files = fs.readdirSync(DOCS_PATH)
//       .filter(file => [".pdf", ".docx", ".txt"].includes(path.extname(file).toLowerCase())) // Filter allowed extensions
//       .map(file => ({
//         name: file,
//         type: path.extname(file).toLowerCase(),
//         url: `/documents/${file}`, // Accessible URL
//       }));

//     return NextResponse.json(files);
//   } catch (error) {
//     console.error("❌ Error fetching documents:", error);
//     return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
//   }
// }


// export async function GET() {
//   try {
//     // Get all files in the directory
//     const files = fs.readdirSync(DOCS_PATH)
//       .filter(file => [".pdf", ".docx", ".txt"].includes(path.extname(file).toLowerCase())) // Filter allowed extensions
//       .map(file => ({
//         name: file,
//         type: path.extname(file).toLowerCase(),
//         url: `/documents/${encodeURIComponent(file)}`, // 🔥 Encode spaces & special characters
//       }));

//     return NextResponse.json(files);
//   } catch (error) {
//     console.error("❌ Error fetching documents:", error);
//     return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
//   }
// }

export async function GET() {
  try {
    // Get all files in the directory
    const files = fs.readdirSync(DOCS_PATH)
      .filter(file => [".pdf", ".docx", ".txt"].includes(path.extname(file).toLowerCase())) // Filter allowed extensions
      .map((file, index) => ({
        id: index + 1, // Assign a unique ID
        name: file,
        type: path.extname(file).toLowerCase(),
        url: `/documents/${encodeURIComponent(file)}`,
        category: "Uncategorized", // Add a default category
      }));

    return NextResponse.json(files);
  } catch (error) {
    console.error("❌ Error fetching documents:", error);
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}







async function generatePDFThumbnail(pdfPath: string, outputPath: string) {
  try {
    const data = new Uint8Array(await fs.readFile(pdfPath)); // Read file into buffer
    const pdf = await getDocument({ data }).promise;
    const page = await pdf.getPage(1);
    
    const scale = 1.5;
    const viewport = page.getViewport({ scale });

    // Use Node.js canvas instead of OffscreenCanvas
    const canvas = createCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext("2d");

    // Render the page into the canvas
    await page.render({ canvasContext: ctx, viewport }).promise;

    // Save as PNG
    const buffer = canvas.toBuffer("image/png");
    await fs.writeFile(outputPath, buffer);

    console.log("✅ Thumbnail generated:", outputPath);
  } catch (error) {
    console.error("❌ Error generating PDF thumbnail:", error);
  }
}

// ✅ DOCX & TXT Text Preview
async function generateTextPreview(filePath: string, type: string) {
  if (type === ".docx") {
    return (await mammoth.extractRawText({ path: filePath })).value.split("\n").slice(0, 10).join("\n");
  }
  return fs.readFileSync(filePath, "utf8").split("\n").slice(0, 10).join("\n");
}
