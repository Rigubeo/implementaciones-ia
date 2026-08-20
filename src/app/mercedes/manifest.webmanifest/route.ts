import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    name: "Mercedes",
    short_name: "Mercedes",
    description: "Sistema clinico de dictado por voz.",
    start_url: "/mercedes",
    scope: "/mercedes",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f5f8fc",
    theme_color: "#061225",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/apple-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ]
  });
}
