import React from "react";
import type { Metadata } from "next";
import PublicSpaceView from "./_components/_client";
import { spaceExists } from "@/actions/spaceActions";
import { notFound } from "next/navigation";
import { spacePageMetadata } from "@/lib/opengraph";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ spaceName: string }>;
}): Promise<Metadata> {
  const { spaceName } = await params;
  const space = await spaceExists(spaceName);
  if (!space) return {};

  return spacePageMetadata({
    title: space.headerTitle,
    description: space.headerSubtitle,
    path: `/${space.name}`,
    image: space.logo,
  });
}

export default async function page({
  params,
}: {
  params: Promise<{ spaceName: string }>;
}) {
  const { spaceName } = await params;

  const foundSpace = await spaceExists(spaceName);

  if (!foundSpace) {
    notFound();
  }

  return <PublicSpaceView space={foundSpace} />;
}
