export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return;
  let originHost = "";
  try { originHost = new URL(origin).host; } catch { throw new Error("Invalid request origin."); }
  if (originHost !== host) throw new Error("Cross-origin request rejected.");
}
