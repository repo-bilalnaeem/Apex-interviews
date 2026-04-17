import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/(dashboard)/", "/call/", "/_next/", "/admin/"],
      },
    ],
    sitemap: "https://aiinterviewagents.com/sitemap.xml",
  };
}
