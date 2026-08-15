import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/auth";
import { uploadImage } from "@/lib/storage";
import { assertSameOrigin } from "@/lib/security";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await assertAdmin();
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "No image supplied." }, { status: 400 });
    const url = await uploadImage(file);
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed." }, { status: 400 });
  }
}
