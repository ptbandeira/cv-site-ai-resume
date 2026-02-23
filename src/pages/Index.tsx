import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FilterSection from "@/components/FilterSection";
import OfferMenu from "@/components/OfferMenu";
import AdultInTheRoom from "@/components/AdultInTheRoom";
import WhenAIGoesWrong from "@/components/WhenAIGoesWrong";
import ProofSection from "@/components/ProofSection";
import ResourceHub from "@/components/ResourceHub";
import InsightPulse from "@/components/InsightPulse";
import StrategicFAQ from "@/components/StrategicFAQ";
import FitAssessment from "@/components/FitAssessment";
import AIChat from "@/components/AIChat";
import FloatingAICTA from "@/components/FloatingAICTA";
import FloatingPulseTeaser from "@/components/FloatingPulseTeaser";
import Footer from "@/components/Footer";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = () => setIsChatOpen(true);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Header onOpenChat={openChat} />
      <main>
        {/* 1. Hero */}
        <Hero onOpenChat={openChat} />

        {/* 2. Qualifier */}
        <FilterSection />

        {/* 3. Services */}
        <OfferMenu />

        {/* 4. Credentials — Experience accessible via accordion */}
        <AdultInTheRoom />

        {/* 5. Risk framing */}
        <WhenAIGoesWrong />

        {/* 6. Proof: demos + field notes in 4 tabs */}
        <ProofSection />

        {/* 7. Tools: ROI calc + SaaS vs build + audit in 3 tabs */}
        <ResourceHub />

        {/* 8. Latest intelligence */}
        <InsightPulse />

        {/* 9. FAQ */}
        <StrategicFAQ />

        {/* 10. Primary CTA */}
        <div id="fit-assessment">
          <FitAssessment />
        </div>
      </main>
      <Footer onOpenChat={openChat} />
      <FloatingAICTA onOpenChat={openChat} />
      <FloatingPulseTeaser />
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Index;
