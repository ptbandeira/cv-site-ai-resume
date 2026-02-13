import { useState, useEffect, useRef } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { BRIDGE_ARCHITECT_PERSONA } from "@/lib/persona";

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const suggestedQuestions = [
  "What is the Bridge Interface?",
  "Tell me about AgenticOS.",
  "Do you have experience with Law Firms?",
  "What freelance services do you offer?",
];

/** Extract plain text from a UIMessage's parts array */
function getMessageText(msg: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!msg.parts) return "";
  return msg.parts
    .filter((p) => p.type === "text" && p.text)
    .map((p) => p.text)
    .join("");
}

const AIChat = ({ isOpen, onClose }: AIChatProps) => {
  if (!isOpen) return null;
  return <AIChatContent isOpen={isOpen} onClose={onClose} />;
};

const AIChatContent = ({ isOpen, onClose }: AIChatProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const chatApiUrl = import.meta.env.VITE_CHAT_API_URL || "/api/chat";

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: chatApiUrl,
      headers: import.meta.env.VITE_SUPABASE_ANON_KEY
        ? { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` }
        : undefined,
    }),
    messages: [
      {
        id: "system-1",
        role: "system" as const,
        parts: [{ type: "text" as const, text: BRIDGE_ARCHITECT_PERSONA }],
      },
    ],
  });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput(0 as unknown as string); // force re-render
    setInput("");
  };

  const onSuggestedClick = (text: string) => {
    sendMessage({ text });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
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
              <p className="text-foreground font-medium">Bridge Architect</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span
                  className={`w-2 h-2 rounded-full ${isLoading ? "bg-amber-400 animate-pulse" : "bg-success"
                    }`}
                />
                {isLoading ? "Thinking..." : "Connected"}
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
          {messages.length <= 1 && (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <Sparkles className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-serif text-foreground mb-2">
                System Interface Active
              </h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-md">
                I am the Bridge Architect. Accessing Pedro's neural context. How
                can I assist you?
              </p>
              <div className="w-full max-w-md space-y-2">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => onSuggestedClick(q)}
                    className="w-full text-left p-3 bg-secondary rounded-xl text-sm text-foreground hover:bg-muted transition-colors border border-transparent hover:border-accent/30"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages
            .filter((m) => m.role !== "system")
            .map((msg, i) => {
              const text = getMessageText(msg);
              if (!text) return null;
              return (
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
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {text}
                    </p>
                  </div>
                </div>
              );
            })}

          {/* Loading Indicator */}
          {isLoading &&
            messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="max-w-[85%] bg-secondary text-foreground rounded-2xl rounded-bl-md px-4 py-3">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    <span className="inline-block w-2 h-4 bg-accent ml-1 animate-typing-cursor" />
                  </p>
                </div>
              </div>
            )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Query the architecture..."
              disabled={isLoading}
              className="flex-1 bg-secondary rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:border-accent focus:outline-none transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
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
