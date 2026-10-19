import { getFeedbackByIdAndSpaceNameWithSpaceLogo } from "@/actions/feedbackActions";
import { spaceExists } from "@/actions/spaceActions";
import PublicPageThemeBar from "@/components/public-page-theme-bar";
import { Button } from "@/components/ui/button";
import { spacePageMetadata, truncateForOg } from "@/lib/opengraph";
import { SingleTestimonialWithSpaceLogo } from "@/lib/types";
import { Heart } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import TestimonialCard from "./_components/testimonial-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ spaceName: string; testimonialId: string }>;
}): Promise<Metadata> {
  const { spaceName, testimonialId } = await params;
  const space = await spaceExists(spaceName);
  if (!space) return {};

  const feedback = await getFeedbackByIdAndSpaceNameWithSpaceLogo(
    spaceName,
    testimonialId,
  );
  if (!feedback) return {};

  const quote = feedback.answer?.trim();

  return spacePageMetadata({
    title: feedback.name,
    description: quote ? truncateForOg(quote) : space.headerSubtitle,
    path: `/${space.name}/testimonial/${feedback.id}`,
    image: space.logo,
  });
}

export default async function page({
  params,
}: {
  params: Promise<{ spaceName: string; testimonialId: string }>;
}) {
  const { spaceName, testimonialId } = await params;

  const spaceResponse = await spaceExists(spaceName);

  if (!spaceResponse) {
    return notFound();
  }

  const feedbackResponse = await getFeedbackByIdAndSpaceNameWithSpaceLogo(
    spaceName,
    testimonialId
  );

  if (!feedbackResponse) {
    return notFound();
  }

  return (
    <div className="lg:max-w-[1000px] mx-auto w-full overflow-x-hidden space-y-4 flex flex-col justify-center">
      <PublicPageThemeBar />
      <div className="p-4 space-y-4 flex flex-col justify-center">
        <TestimonialCard
          testimonial={
            feedbackResponse as unknown as SingleTestimonialWithSpaceLogo
          }
        />
        <Link href={`/${spaceName}/wall-of-love`} className="w-max mx-auto">
          <Button variant={"outline"}>
            <Heart className="mr-2 fill-red-500 text-red-500" size={16} />
            Our Wall of Love
          </Button>
        </Link>
      </div>
    </div>
  );
}
