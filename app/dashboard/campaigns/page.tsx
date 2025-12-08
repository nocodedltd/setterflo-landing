"use client";

import { useState } from "react";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { CampaignSummaryStrip } from "@/components/campaigns/CampaignSummaryStrip";
import { NewCampaignWizard } from "@/components/campaigns/NewCampaignWizard";
import { Button } from "@/components/ui/Button";
import { Plus, Search, Rocket, LayoutGrid, List as ListIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const campaigns = [
  {
    id: "1",
    name: "Health Coaches Q1",
    status: "active" as const,
    target: "@bigfitinfluencer followers",
    targetCount: "250K",
    sent: 180,
    total: 500,
    responses: 45,
    qualified: 12,
    booked: 4,
    startDate: "Dec 5, 2024",
    dailyLimit: 45
  },
  {
    id: "2",
    name: "Mindset Gurus",
    status: "paused" as const,
    target: "@mindset_daily",
    targetCount: "120K",
    sent: 450,
    total: 1000,
    responses: 82,
    qualified: 24,
    booked: 7,
    startDate: "Nov 20, 2024",
    dailyLimit: 60 // High risk
  },
  {
    id: "3",
    name: "Business Consultants",
    status: "draft" as const,
    target: "Hashtag #businesscoach",
    targetCount: "Unknown",
    sent: 0,
    total: 200,
    responses: 0,
    qualified: 0,
    booked: 0,
    startDate: "-"
  }
];

export default function CampaignsPage() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.06]">
        <div className="space-y-2">
          <h1 className="text-3xl font-heading font-bold text-white tracking-tight flex items-center gap-3">
            <Rocket className="h-8 w-8 text-primary-400" />
            Outbound Engine
          </h1>
          <p className="text-text-secondary max-w-lg">
            Manage your automated outreach campaigns and monitor performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted group-focus-within:text-primary-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search campaigns..." 
              className="bg-black/20 border border-white/[0.1] rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 w-64 transition-all"
            />
          </div>
          
          <div className="flex items-center bg-white/[0.03] p-1 rounded-lg border border-white/[0.06]">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-md transition-all",
                viewMode === 'grid' ? "bg-white/[0.08] text-white shadow-sm" : "text-text-secondary hover:text-white"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-md transition-all",
                viewMode === 'list' ? "bg-white/[0.08] text-white shadow-sm" : "text-text-secondary hover:text-white"
              )}
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>

          <Button onClick={() => setIsWizardOpen(true)} className="bg-primary hover:bg-primary-600 text-white gap-2 shadow-lg shadow-primary/20 h-10">
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Summary Strip */}
      <CampaignSummaryStrip />

      {/* Campaign Grid */}
      <div className={cn(
        "grid gap-6",
        viewMode === 'grid' ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
      )}>
        {campaigns.map(campaign => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
        
        {/* Create New Placeholder (Grid Only) */}
        {viewMode === 'grid' && (
          <button 
            onClick={() => setIsWizardOpen(true)}
            className="flex flex-col items-center justify-center gap-4 h-full min-h-[320px] border-2 border-dashed border-white/[0.06] rounded-2xl hover:border-primary/30 hover:bg-white/[0.02] transition-all group cursor-pointer"
          >
            <div className="h-16 w-16 rounded-full bg-white/[0.03] flex items-center justify-center group-hover:bg-primary/10 transition-colors border border-white/[0.06] group-hover:border-primary/20">
              <Plus className="h-8 w-8 text-text-muted group-hover:text-primary-400 transition-colors" />
            </div>
            <div className="text-center space-y-1">
              <p className="font-bold text-white text-lg group-hover:text-primary-200 transition-colors">Create New Campaign</p>
              <p className="text-sm text-text-secondary">Launch a new outreach sequence</p>
            </div>
          </button>
        )}
      </div>

      {/* Wizard Modal */}
      {isWizardOpen && <NewCampaignWizard onClose={() => setIsWizardOpen(false)} />}
    </div>
  );
}
