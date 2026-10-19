import type { Metadata } from "next";

export const SITE_NAME = "TestiFlow";
export const SITE_TITLE =
  "TestiFlow — Collect and showcase customer testimonials";
export const SITE_DESCRIPTION =
  "Collect text and video testimonials in one link, filter out spam, and publish a Wall of Love you can embed on your site.";
export const OG_IMAGE_ALT =
  "TestiFlow, collect and showcase customer testimonials";

const FALLBACK_OG_IMAGE = "/og";
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

export function getMetadataBase() {
  return new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000");
}

const fallbackImage = {
  url: FALLBACK_OG_IMAGE,
  width: OG_WIDTH,
  height: OG_HEIGHT,
  alt: OG_IMAGE_ALT,
};

export const siteMetadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: SITE_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    images: [fallbackImage],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
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

function pageImages(url: string | null | undefined, alt: string) {
  const resolved = ogImage(url);
  if (resolved === FALLBACK_OG_IMAGE) return [fallbackImage];
  return [{ url: resolved, alt }];
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
  const images = pageImages(image, title);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      title,
      description,
      url: path,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((item) => item.url),
    },
  };
}

export function truncateForOg(text: string, max = 160) {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trimEnd()}…`;
}
