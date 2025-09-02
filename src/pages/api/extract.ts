// src/pages/api/extract.ts
import type { NextApiRequest, NextApiResponse } from "next";
import formidable, {
  type File as FormidableFile,
  type Files,
  type Fields,
} from "formidable";
import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";

export const config = {
  api: { bodyParser: false }, // important for file uploads
};

type Ok = {
  text: string;
  source: "pdf-parse" | "mammoth" | "utf8" | "ocr";
  ocrProvider?: string;
};
type Err = { error: string };

const MIN_TEXT_LEN = 120; // if below this, try OCR fallback

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Ok | Err>
) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const form = formidable({ multiples: false, maxFileSize: 25 * 1024 * 1024 }); // 25MB

    // ✅ Correct typings for formidable v3:
    const { fields, files } = await new Promise<{ fields: Fields; files: Files }>(
      (resolve, reject) => {
        form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({ fields, files })));
      }
    );

    const file = pickFirstFile(files);
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    // Formidable v3 stores temp path at "filepath"
    const filepath = (file as any).filepath || (file as any).path;
    const original =
      (file as any).originalFilename || (file as any).name || "upload";
    const ext = path.extname(original).toLowerCase();
    const mimetype = (file as any).mimetype || "application/octet-stream";

    const buffer = await fs.promises.readFile(filepath);

    // 1) Native extract by type
    let text = "";
    let source: Ok["source"] | null = null;

    if (ext === ".pdf") {
      try {
        const data = await pdfParse(buffer);
        text = (data.text || "").trim();
        source = "pdf-parse";
      } catch {}
    } else if (ext === ".docx" || ext === ".doc") {
      try {
        const result = await mammoth.extractRawText({ buffer });
        text = (result.value || "").trim();
        source = "mammoth";
      } catch {}
    } else if (ext === ".txt" || ext === ".md" || mimetype.startsWith("text/")) {
      text = buffer.toString("utf8").trim();
      source = "utf8";
    }

    if (text) {
      text = text.replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").trim();
    }

    // 2) OCR fallback if too short or if it’s an image
    const looksLikeImage =
      mimetype.startsWith("image/") ||
      [".png", ".jpg", ".jpeg", ".webp", ".tif", ".tiff"].includes(ext);

    if (!text || text.length < MIN_TEXT_LEN || looksLikeImage) {
      const apiKey = process.env.OCRSPACE_API_KEY;
      if (apiKey) {
        const ocrText = await ocrWithOCRSpace(buffer, original, mimetype, apiKey);
        if (ocrText?.trim()) {
          const cleaned = ocrText.replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").trim();
          return res.status(200).json({ text: cleaned, source: "ocr", ocrProvider: "ocr.space" });
        }
      }
      // If no OCR key or OCR failed, we’ll continue to fallback below.
    }

    // 3) Final fallback: utf8 decode
    if (!text) {
      text = buffer.toString("utf8").trim();
      source = source ?? "utf8";
    }

    return res.status(200).json({ text, source: source || "utf8" });
  } catch (err) {
    console.error("extract error:", err);
    return res.status(500).json({ error: "Extraction failed" });
  }
}

/** Safely pick the first uploaded file from formidable.Files (handles File | File[]) */
function pickFirstFile(files: Files): FormidableFile | null {
  // Common case: field name "file"
  const primary = (files as any).file;
  if (Array.isArray(primary)) return primary[0] || null;
  if (primary) return primary as FormidableFile;

  // Otherwise, grab the first key in Files
  for (const key of Object.keys(files)) {
    const v = (files as any)[key];
    if (Array.isArray(v)) return v[0] || null;
    if (v) return v as FormidableFile;
  }
  return null;
}

/** OCR via OCR.space (works for scanned PDFs & images) */
async function ocrWithOCRSpace(
  buffer: Buffer,
  filename: string,
  mimetype: string,
  apiKey: string
): Promise<string | null> {
  try {
    // Convert Node Buffer -> ArrayBuffer slice (compatible BlobPart)
    const arrayBuffer = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    );

    // Node 18+ has global fetch/FormData/Blob
    const fd = new FormData();
    const blob = new Blob([new Uint8Array(buffer)], {
      type: mimetype || "application/octet-stream",
    });

    fd.append("file", blob, filename);
    fd.append("apikey", apiKey);
    fd.append("language", "eng");
    fd.append("isOverlayRequired", "false");
    fd.append("scale", "true"); // improves small text accuracy
    fd.append("OCREngine", "2"); // newer engine

    const resp = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      body: fd,
    });

    if (!resp.ok) return null;
    const data = (await resp.json()) as any;

    if (data?.IsErroredOnProcessing) {
      console.error("OCR.space error:", data?.ErrorMessage || data);
      return null;
    }

    const parsed = data?.ParsedResults?.[0]?.ParsedText ?? "";
    return parsed || null;
  } catch (e) {
    console.error("OCR fallback failed:", e);
    return null;
  }
}
