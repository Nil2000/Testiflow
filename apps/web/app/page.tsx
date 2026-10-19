import LandingPage from "@/components/landing-page";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  const session = await auth();
  return <LandingPage session={session} />;
}
