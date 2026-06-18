"use client";

import { Navigation } from "@/components/layout/Navigation";
import RetentionCalculator from "@/components/landing/RetentionCalculator";

export default function ChurnCalculatorPage() {
  return (
    <>
      <Navigation dark />
      <RetentionCalculator />
    </>
  );
}
