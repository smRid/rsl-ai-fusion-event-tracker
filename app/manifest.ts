import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RSL Fusion Tracker",
    short_name: "RSL Fusion",
    description:
      "AI-powered Raid: Shadow Legends fusion calendar tracker for events, tournaments, fragments, and leaderboard rewards.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#020617",
    theme_color: "#020617",
    categories: ["games", "productivity", "utilities"],
    icons: [
      {
        src: "/logo.png",
        sizes: "612x408",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/logo.png",
        sizes: "612x408",
        type: "image/png",
        purpose: "maskable"
      }
    ],
    shortcuts: [
      {
        name: "Open Tracker",
        short_name: "Tracker",
        description: "Open your saved fusion tracker.",
        url: "/tracker",
        icons: [{ src: "/logo.png", sizes: "612x408", type: "image/png" }]
      },
      {
        name: "Admin",
        short_name: "Admin",
        description: "Open the protected admin editor.",
        url: "/admin",
        icons: [{ src: "/logo.png", sizes: "612x408", type: "image/png" }]
      }
    ]
  };
}
