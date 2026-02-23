import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FilterSection from "@/components/FilterSection";
import OfferMenu from "@/components/OfferMenu";
import AdultInTheRoom from "@/components/AdultInTheRoom";
import WhenAIGoesWrong from "@/components/WhenAIGoesWrong";
// import MiniAppSandbox from "@/components/MiniAppSandbox";
import Experience from "@/components/Experience";
import FitAssessment from "@/components/FitAssessment";
import SaasVsBuild from "@/components/SaasVsBuild";
// import AutomationAuditor from "@/components/AutomationAuditor";
// import AnalogAdvantage from "@/components/AnalogAdvantage";
// import InsightPulse from "@/components/InsightPulse";
// import FieldNoteLawFirm from "@/components/FieldNoteLawFirm";
// import TeamsAgentDemo from "@/components/TeamsAgentDemo";
// import DataTransformation from "@/components/DataTransformation";
import SavingsCalculator from "@/components/SavingsCalculator";
import StrategicFAQ from "@/components/StrategicFAQ";
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
        <Hero onOpenChat={openChat} />
        <FilterSection />
        <OfferMenu />
        <AdultInTheRoom />
        <WhenAIGoesWrong />
        {/* <AnalogAdvantage onOpenChat={openChat} /> */}
        {/* TeamsAgentDemo, DataTransformation, FieldNoteLawFirm moved to Pulse/dedicated pages */}
        <div id="resource-audit">
          <SavingsCalculator />
          <SaasVsBuild />
        </div>
        {/* AutomationAuditor, MiniAppSandbox available at /audit and /sandbox */}
        <Experience />
        {/* InsightPulse removed — Pulse linked from nav */}
        <StrategicFAQ />
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
