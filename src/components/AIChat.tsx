import { useState, useEffect, useRef } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { demoResponses } from "@/data/marcus-profile";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const suggestedQuestions = [
  "Would this person be good for a Series B startup with messy data infrastructure?",
  "How did they reduce costs by $1.2M? Was it technical or political?",
  "Tell me about their biggest failure.",
  "What kind of leadership experience do they have?",
];

const AIChat = ({ isOpen, onClose }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [displayedResponse, setDisplayedResponse] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, displayedResponse]);

  const getResponse = (question: string): string => {
    const q = question.toLowerCase();
    if (q.includes("series b") || q.includes("infrastructure") || q.includes("messy")) {
      return demoResponses.default;
    }
    if (q.includes("cost") || q.includes("$1.2m") || q.includes("reduce")) {
      return demoResponses.costReduction;
    }
    if (q.includes("failure") || q.includes("mistake") || q.includes("wrong")) {
      return demoResponses.failure;
    }
    if (q.includes("leadership") || q.includes("lead") || q.includes("team") || q.includes("manage")) {
      return demoResponses.leadership;
    }
    return demoResponses.default;
  };

  const typeResponse = (response: string) => {
    setIsTyping(true);
    setDisplayedResponse("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < response.length) {
        setDisplayedResponse(response.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setMessages((prev) => [...prev, { role: "assistant", content: response }]);
        setDisplayedResponse("");
      }
    }, 8);
  };

  const handleSubmit = (question: string) => {
    if (!question.trim() || isTyping) return;
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setTimeout(() => {
      const response = getResponse(question);
      typeResponse(response);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl h-[80vh] bg-card border border-border rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-accent-foreground font-serif font-bold">
              M
            </div>
            <div>
              <p className="text-foreground font-medium">Ask AI About Marcus</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                Ready to answer your questions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !isTyping && (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <Sparkles className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-serif text-foreground mb-2">
                What would you like to know?
              </h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-md">
                Ask specific questions about Marcus's experience, skills, or fit for your role. Get honest, detailed answers.
              </p>
              <div className="w-full max-w-md space-y-2">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSubmit(q)}
                    className="w-full text-left p-3 bg-secondary rounded-xl text-sm text-foreground hover:bg-muted transition-colors border border-transparent hover:border-accent/30"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3",
                  msg.role === "user"
                    ? "bg-accent text-accent-foreground rounded-br-md"
                    : "bg-secondary text-foreground rounded-bl-md"
                )}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[85%] bg-secondary text-foreground rounded-2xl rounded-bl-md px-4 py-3">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {displayedResponse}
                  <span className="inline-block w-2 h-4 bg-accent ml-1 animate-typing-cursor" />
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(input);
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a follow-up question..."
              disabled={isTyping}
              className="flex-1 bg-secondary rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:border-accent focus:outline-none transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-4 py-3 bg-accent text-accent-foreground rounded-xl font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
