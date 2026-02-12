"use client";

import Background from "@/components/shared/Background";
import Header from "@/components/shared/Header";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";

export default function Home() {
  return (
    <Background>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Hero />
        <HowItWorks />
      </div>
    </Background>
  );
}
