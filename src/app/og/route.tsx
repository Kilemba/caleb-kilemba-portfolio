import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/settings";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social share card, generated so it always matches current site settings.
 *
 * `?title=` overrides the heading, which lets a blog post without its own cover image
 * still get a card naming the post rather than the generic site card.
 */
export async function GET(request: Request) {
  const settings = await getSiteSettings();
  const title = new URL(request.url).searchParams.get("title")?.slice(0, 110) || settings.heroHeading;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(150deg, #f2faf9 0%, #ffffff 60%)",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#0f766e" }} />
          <div style={{ fontSize: 26, fontWeight: 700, color: "#0b5f59", letterSpacing: 2 }}>
            {settings.professionalTitle.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 62, fontWeight: 800, color: "#172033", lineHeight: 1.15 }}>
          {title}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 800, color: "#0f766e" }}>{settings.name}</div>
          <div style={{ display: "flex", fontSize: 24, color: "#5f6b7a" }}>Google BigQuery · Data Pipelines</div>
        </div>
      </div>
    ),
    size
  );
}
