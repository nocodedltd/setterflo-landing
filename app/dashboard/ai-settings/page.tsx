"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MessageSquare, Sliders, Zap, Bot, Play } from "lucide-react";
import { cn } from "@/lib/utils";

// Sub-components
import { ToneSettings } from "@/components/ai-settings/ToneSettings";
import { BehaviorRules } from "@/components/ai-settings/BehaviorRules";
import { TestChat } from "@/components/ai-settings/TestChat";

const tabs = [
  { id: "test", label: "Test Simulator", icon: Play },
  { id: "tone", label: "Tone & Voice", icon: Sliders },
  { id: "behavior", label: "Behavior Rules", icon: Zap },
  { id: "scripts", label: "Scripts Library", icon: MessageSquare },
];

export default function AISettingsPage() {
  const [activeTab, setActiveTab] = useState("tone");

  return (
    <div className="space-y-8 animate-fade-in flex flex-col h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 shrink-0">
        <div className="space-y-2">
          <h1 className="text-3xl font-heading font-bold text-white tracking-tight flex items-center gap-3">
            <Bot className="h-8 w-8 text-primary-400" />
            AI Setter Config
          </h1>
          <p className="text-text-secondary max-w-lg">
            Fine-tune your AI's personality, behavior, and sales logic.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white/[0.03] rounded-lg border border-white/[0.06] w-fit shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
              activeTab === tab.id
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-text-secondary hover:text-white hover:bg-white/[0.05]"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 pt-4 pb-8 overflow-y-auto no-scrollbar">
        {activeTab === "test" && <TestChat />}
        {activeTab === "tone" && <ToneSettings />}
        {activeTab === "behavior" && <BehaviorRules />}
        {activeTab === "scripts" && (
          <div className="flex flex-col items-center justify-center h-full text-text-muted glass-panel rounded-2xl border-dashed border-2 border-white/10">
            <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
            <p>Scripts Library coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
