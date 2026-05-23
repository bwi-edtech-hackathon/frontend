import { TopNav } from "@/components/landing/TopNav";
import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { SubjectsSection } from "@/components/landing/SubjectsSection";
import { DemoTeaser } from "@/components/landing/DemoTeaser";
import { ForWhom } from "@/components/landing/ForWhom";
import { Team } from "@/components/landing/Team";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function Landing() {
  return (
    <div className="bg-white">
      <TopNav />
      <Hero />
      <Problem />
      <HowItWorks />
      <SubjectsSection />
      <DemoTeaser />
      <ForWhom />
      <Team />
      <FinalCTA />
      <Footer />
    </div>
  );
}
