import { Zap, Globe } from "lucide-react";
import React from "react";

export interface PulseItem {
    id: string;
    slug: string;
    icon: React.ReactNode;
    color: string;
    iconBg: string;
    noise: string;
    translation: string;
    action: string;
    date: string;
    sources?: { label: string; url: string }[];
}

export const pulseItems: PulseItem[] = [
    {
        id: "anthropic-enterprise",
        slug: "anthropic-enterprise-reasoning",
        icon: React.createElement(Zap, { className: "w-5 h-5" }),
        color: "from-amber-500 to-orange-500",
        iconBg: "bg-amber-100 text-amber-700",
        noise: "OpenAI releases o3, Anthropic releases Claude 4.6.",
        translation: "Models are getting cheaper, not just smarter. Enterprise reasoning is now reliable enough for a Managing Partner's desk.",
        action: "We can move your document review from GPT-4 to Claude Haiku, saving 90% on API costs without losing accuracy. I can implement this switch in 1–3 days if the pipeline is clean.",
        date: "Feb 2026",
        sources: [
            { label: "Anthropic Enterprise", url: "https://www.anthropic.com/enterprise" }
        ]
    },
    {
        id: "openclaw-sovereignty",
        slug: "openclaw-sovereignty",
        icon: React.createElement(Globe, { className: "w-5 h-5" }),
        color: "from-primary to-orange-400",
        iconBg: "bg-orange-100 text-orange-700",
        noise: "Meta releases Llama 4, OpenClaw launches open-source agent framework.",
        translation: "Self-hosted models are now good enough for production workloads. You can stop sending client data to US servers.",
        action: "I can redeploy your document processing pipeline to run on-premise using Llama 4 + OpenClaw — comparable quality on the right tasks, full data sovereignty, zero API costs.",
        date: "Feb 2026",
        sources: [
            { label: "OpenClaw Framework", url: "https://github.com/openclaw/framework" },
            { label: "Meta Llama", url: "https://llama.meta.com/" }
        ]
    },
];
