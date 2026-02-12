import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MiniAppSandbox from "@/components/MiniAppSandbox";
import Experience from "@/components/Experience";
import FitAssessment from "@/components/FitAssessment";
import SaaSAudit from "@/components/SaaSAudit";
import AnalogAdvantage from "@/components/AnalogAdvantage";
import AIChat from "@/components/AIChat";
import Footer from "@/components/Footer";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = () => setIsChatOpen(true);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Header onOpenChat={openChat} />
      <main>
        <Hero onOpenChat={openChat} />
        <MiniAppSandbox />
        <AnalogAdvantage />
        <SaaSAudit />
        <FitAssessment />
        <Experience />
      </main>
      <Footer />
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Index;
