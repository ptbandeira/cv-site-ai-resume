import Header from "@/components/Header";
import ProofSection from "@/components/ProofSection";
import Footer from "@/components/Footer";
import { useState } from "react";
import AIChat from "@/components/AIChat";

const Proof = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Header onOpenChat={() => setIsChatOpen(true)} />
      <main className="pt-20">
        <ProofSection />
      </main>
      <Footer onOpenChat={() => setIsChatOpen(true)} />
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Proof;
