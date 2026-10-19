import {
  getTestimonialsForWallOfLove,
  spaceExists,
} from "@/actions/spaceActions";
import { spacePageMetadata } from "@/lib/opengraph";
import { TestimonialResponse } from "@/lib/types";
import type { WallOfLoveSettings } from "@/lib/wall-of-love-settings";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import WallOfLovePage, {
  type WallOfLoveSpaceBranding,
} from "./_components/_client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ spaceName: string }>;
}): Promise<Metadata> {
  const { spaceName } = await params;
  const space = await spaceExists(spaceName);
  if (!space) return {};

  return spacePageMetadata({
    title: "Wall of Love",
    description: space.headerTitle,
    path: `/${space.name}/wall-of-love`,
    image: space.logo,
  });
}

export default async function page({
  params,
}: {
  params: Promise<{ spaceName: string }>;
}) {
  const { spaceName } = await params;

  const response = await getTestimonialsForWallOfLove(spaceName);

  if ("error" in response) notFound();

  return (
    <WallOfLovePage
      spaceName={spaceName}
      testimonialList={response.data as TestimonialResponse[]}
      wallOfLoveSettings={response.wallOfLoveSettings as WallOfLoveSettings}
      space={response.space as WallOfLoveSpaceBranding}
    />
  );
}
