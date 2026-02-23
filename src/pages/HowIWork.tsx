import Header from "@/components/Header";
import AdultInTheRoom from "@/components/AdultInTheRoom";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import { useState } from "react";
import AIChat from "@/components/AIChat";

const HowIWork = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Header onOpenChat={() => setIsChatOpen(true)} />
      <main className="pt-20">
        <AdultInTheRoom />
        <Experience />
      </main>
      <Footer onOpenChat={() => setIsChatOpen(true)} />
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default HowIWork;
