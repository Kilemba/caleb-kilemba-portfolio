"use client";
import { useState } from "react";

export function ImageField({ name, defaultValue = "", label = "Cover image" }: { name: string; defaultValue?: string | null; label?: string }) {
  const [value, setValue] = useState(defaultValue || "");
  const [status, setStatus] = useState("");
  async function upload(file?: File) {
    if (!file) return;
    setStatus("Uploading...");
    const body = new FormData(); body.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body });
    const data = await response.json();
    if (!response.ok) { setStatus(data.error || "Upload failed"); return; }
    setValue(data.url); setStatus("Uploaded");
  }
  return <div><label className="label" htmlFor={name}>{label}</label><input className="field" id={name} name={name} value={value} onChange={(e) => setValue(e.target.value)} placeholder="Image URL or upload below" /><input className="mt-2 block text-sm" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => upload(e.target.files?.[0])} />{status && <p className="muted mt-1 text-xs">{status}</p>}{value && <img src={value} alt="Image preview" className="mt-3 h-32 rounded-lg border border-[#e1e7ec] object-cover" />}</div>;
}
