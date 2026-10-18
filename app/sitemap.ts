import type {MetadataRoute} from "next";
import { guides } from "../data/records";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://carpaintfinder.com";
  const paths = [
    "/", "/paint-codes", "/how-to-find-paint-code", "/about", "/privacy", "/terms", "/contact",
    "/paint-code-guides/honda-accord-hybrid-2024",
    "/paint-code-guides/chevrolet-equinox-ev-2025",
    ...guides.map((guide) => "/paint-codes/" + guide.slug),
  ];
  return paths.map((path) => ({ url: base + path, changeFrequency: "monthly", priority: path === "/" ? 1 : 0.5 }));
}
