import type { Metadata } from "next";

export const SITE_NAME = "TestiFlow";
export const SITE_DESCRIPTION =
  "Collect, manage, and showcase testimonials with TestiFlow.";

const FALLBACK_OG_IMAGE = "/og";

export function getMetadataBase() {
  return new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000");
}

export const siteMetadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [FALLBACK_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [FALLBACK_OG_IMAGE],
  },
};

function ogImage(url: string | null | undefined) {
  if (!url) return FALLBACK_OG_IMAGE;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return url;
    }
  } catch {
    // Relative or invalid URLs are not usable as crawler images.
  }
  return FALLBACK_OG_IMAGE;
}

export function spacePageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
}): Metadata {
  const resolved = ogImage(image);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: path,
      images: [resolved],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [resolved],
    },
  };
}

export function truncateForOg(text: string, max = 160) {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trimEnd()}…`;
}
