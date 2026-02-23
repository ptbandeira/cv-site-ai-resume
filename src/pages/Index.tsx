import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FilterSection from "@/components/FilterSection";
import OfferMenu from "@/components/OfferMenu";
import WhenAIGoesWrong from "@/components/WhenAIGoesWrong";
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
        {/* 1. Hook */}
        <Hero onOpenChat={openChat} />

        {/* 2. Qualifier */}
        <FilterSection />

        {/* 3. Services */}
        <OfferMenu />

        {/* 4. Risk framing */}
        <WhenAIGoesWrong />

        {/* 5. Latest intelligence — links to /pulse */}
        <InsightPulse />

        {/* 6. FAQ */}
        <StrategicFAQ />

        {/* 7. CTA */}
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
