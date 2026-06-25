import { createClient } from "@/lib/supabase/server";
import { extractText } from "unpdf";
import * as mammoth from "mammoth";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file || file.size === 0) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  const name = file.name.toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());

  let text = "";

  if (name.endsWith(".pdf")) {
    const result = await extractText(new Uint8Array(buffer), { mergePages: true });
    text = result.text as string;
  } else if (name.endsWith(".docx")) {
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;
  } else if (name.endsWith(".txt")) {
    text = buffer.toString("utf-8");
  } else {
    return Response.json(
      { error: "Unsupported file type. Upload a PDF, DOCX, or TXT file." },
      { status: 400 }
    );
  }

  const trimmed = text.trim();
  if (!trimmed) {
    return Response.json(
      { error: "Could not extract any text from the file" },
      { status: 400 }
    );
  }

  return Response.json({ data: { text: trimmed, fileName: file.name } });
}
