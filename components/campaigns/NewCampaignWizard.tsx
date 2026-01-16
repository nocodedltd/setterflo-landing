"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, ArrowRight, User, Target, MessageSquare, Clock, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

// Steps definition
const steps = [
  { id: 1, label: "Basics", icon: User },
  { id: 2, label: "Targeting", icon: Target },
  { id: 3, label: "Messaging", icon: MessageSquare },
  { id: 4, label: "Schedule & Limits", icon: Clock },
  { id: 5, label: "Review", icon: Shield },
];

export function NewCampaignWizard({ onClose }: { onClose: () => void }) {
  const currentStep = 1; // Mock state

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-[85vh] bg-[#050A14] border border-white/[0.08] rounded-2xl shadow-2xl flex overflow-hidden animate-fade-in">
        
        {/* Sidebar: Steps & Summary */}
        <div className="w-64 border-r border-white/[0.06] bg-white/[0.02] flex flex-col">
          <div className="p-6 border-b border-white/[0.06]">
            <h2 className="text-lg font-heading font-bold text-white">New Campaign</h2>
            <p className="text-xs text-text-secondary mt-1">Launch a new sequence</p>
          </div>
          
          <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
            {steps.map((step) => (
              <div 
                key={step.id}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  step.id === currentStep ? "bg-primary/10 text-primary-400 border border-primary/20" : 
                  step.id < currentStep ? "text-white" : "text-text-muted"
                )}
              >
                <div className={cn(
                  "h-6 w-6 rounded-full flex items-center justify-center text-xs border",
                  step.id === currentStep ? "border-primary-400 text-primary-400" : 
                  step.id < currentStep ? "bg-success-500 border-success-500 text-white" : 
                  "border-white/10 text-text-muted"
                )}>
                  {step.id < currentStep ? <CheckCircle2 className="h-3.5 w-3.5" /> : step.id}
                </div>
                <span>{step.label}</span>
              </div>
            ))}
          </div>

          {/* Live Summary (Mini) */}
          <div className="p-4 bg-black/20 border-t border-white/[0.06]">
            <h4 className="text-[10px] uppercase font-bold tracking-wider text-text-muted mb-3">Campaign Summary</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-text-secondary">Target:</span>
                <span className="text-white font-medium">--</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Daily Limit:</span>
                <span className="text-white font-medium">--</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-[#050A14] to-[#0B1426]">
          <div className="flex-1 p-8 overflow-y-auto">
             {/* Mock Step Content */}
             <div className="max-w-2xl mx-auto space-y-6">
               <div className="space-y-2">
                 <h1 className="text-2xl font-bold text-white">Campaign Basics</h1>
                 <p className="text-text-secondary">Let's give your campaign a name and objective.</p>
               </div>
               
               <Card className="glass-panel border-white/[0.08]">
                 <CardContent className="p-6 space-y-4">
                   <div className="space-y-2">
                     <label className="text-sm font-medium text-white">Campaign Name</label>
                     <input type="text" placeholder="e.g. Health Coaches Outreach Q1" className="w-full bg-black/20 border border-white/[0.1] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all" />
                   </div>
                 </CardContent>
               </Card>
             </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-white/[0.06] bg-white/[0.02] flex justify-between items-center">
            <Button variant="ghost" onClick={onClose} className="text-text-secondary hover:text-white">Cancel</Button>
            <Button className="bg-primary hover:bg-primary-600 text-white shadow-lg shadow-primary/20 gap-2">
              Next Step <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
