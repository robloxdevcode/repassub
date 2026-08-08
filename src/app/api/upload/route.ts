import { NextRequest, NextResponse } from "next/server";
import { getUploadUrl, generateFileKey } from "@/lib/storage";
import { requireUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const { fileName, contentType } = await req.json();

    if (!fileName || !contentType) {
      return NextResponse.json({ error: "Missing fileName or contentType" }, { status: 400 });
    }

    const key = generateFileKey(user.id, fileName);
    const { uploadUrl, publicUrl } = await getUploadUrl(key, contentType);

    return NextResponse.json({ uploadUrl, publicUrl, key });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
