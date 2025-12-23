"use client";

import { useState } from "react";
import { LeadCard } from "@/components/leads/LeadCard";
import { Button } from "@/components/ui/Button";
import { Search, Filter, Download, Plus, LayoutList, Kanban, Trello } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const leads = [
  {
    id: "1",
    name: "Sarah Johnson",
    handle: "@sarah_mindset",
    status: "active" as const,
    location: "London, UK",
    role: "Mindset Coach",
    lastMessage: "Yes, let's book a call...",
    lastMessageTime: "5m ago",
    score: 85,
    stage: "contacted"
  },
  {
    id: "2",
    name: "Mark Business",
    handle: "@mark_biz",
    status: "qualified" as const,
    location: "New York, USA",
    role: "Business Coach",
    lastMessage: "What are your rates?",
    lastMessageTime: "12m ago",
    score: 92,
    stage: "qualified"
  },
  {
    id: "3",
    name: "Alex Coach",
    handle: "@alex_johnson",
    status: "booked" as const,
    location: "Sydney, AU",
    role: "Fitness Coach",
    lastMessage: "See you on Tuesday!",
    lastMessageTime: "2m ago",
    score: 95,
    stage: "booked"
  },
   {
    id: "4",
    name: "Jenny Wilson",
    handle: "@jenny_w",
    status: "pending" as const,
    location: "Toronto, CA",
    role: "Life Coach",
    lastMessage: "I'm interested.",
    lastMessageTime: "1h ago",
    score: 60,
    stage: "new"
  },
];

const stages = [
  { id: "new", title: "New Lead", count: 23, color: "bg-blue-500" },
  { id: "contacted", title: "Contacted", count: 47, color: "bg-purple-500" },
  { id: "qualified", title: "Qualified", count: 15, color: "bg-pink-500" },
  { id: "booked", title: "Booked", count: 8, color: "bg-success-500" },
  { id: "closed", title: "Closed", count: 12, color: "bg-warning-500" },
];

export default function LeadsPage() {
  const [view, setView] = useState<'list' | 'kanban' | 'pipeline'>('kanban');

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0 pb-2">
        <div className="space-y-2">
          <h1 className="text-3xl font-heading font-bold text-white tracking-tight">Leads & CRM</h1>
          <p className="text-text-secondary max-w-lg">
            Manage your pipeline, track conversations, and qualify leads.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted group-focus-within:text-primary-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search leads..." 
              className="bg-black/20 border border-white/[0.1] rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 w-64 transition-all"
            />
          </div>
          <Button variant="outline" className="border-white/[0.1] text-text-secondary hover:text-white bg-transparent hover:bg-white/5 gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="bg-primary hover:bg-primary-600 text-white gap-2 shadow-lg shadow-primary/20">
            <Download className="h-4 w-4" />
            Import CSV
          </Button>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between py-2 shrink-0">
         <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-lg border border-white/[0.06]">
            <button
              onClick={() => setView('list')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                view === 'list' 
                  ? "bg-white/[0.08] text-white shadow-sm" 
                  : "text-text-secondary hover:text-white hover:bg-white/[0.02]"
              )}
            >
                <LayoutList className="h-4 w-4" />
                List
            </button>
            <button
              onClick={() => setView('kanban')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                view === 'kanban' 
                  ? "bg-white/[0.08] text-white shadow-sm" 
                  : "text-text-secondary hover:text-white hover:bg-white/[0.02]"
              )}
            >
                <Kanban className="h-4 w-4" />
                Kanban
            </button>
            <button
              onClick={() => setView('pipeline')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                view === 'pipeline' 
                  ? "bg-white/[0.08] text-white shadow-sm" 
                  : "text-text-secondary hover:text-white hover:bg-white/[0.02]"
              )}
            >
                <Trello className="h-4 w-4" />
                Pipeline
            </button>
         </div>
         
         <div className="flex items-center gap-4 text-xs text-text-muted">
           <span className="flex items-center gap-1.5">
             <span className="h-2 w-2 rounded-full bg-success-500 animate-pulse"></span>
             Real-time updates active
           </span>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 relative -mx-4 px-4 overflow-hidden">
        {view === 'kanban' ? (
          <div className="h-full overflow-x-auto overflow-y-hidden pb-4">
            <div className="flex gap-6 h-full min-w-max pb-2">
              {stages.map((stage) => (
                <div key={stage.id} className="w-80 flex-shrink-0 flex flex-col h-full">
                  {/* Column Header */}
                  <div className="mb-3 flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${stage.color} shadow-[0_0_8px_currentColor]`} />
                      <h3 className="font-bold text-sm text-white">{stage.title}</h3>
                    </div>
                    <span className="bg-white/10 text-text-secondary text-xs font-medium px-2 py-0.5 rounded-md">{stage.count}</span>
                  </div>
                  
                  {/* Column Body */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {leads.filter(l => l.stage === stage.id).map(lead => (
                      <LeadCard key={lead.id} lead={lead} />
                    ))}
                    <button className="w-full py-3 rounded-xl border border-dashed border-white/10 text-text-muted text-sm hover:bg-white/[0.02] hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2 group">
                      <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      Add Lead
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-text-muted glass-panel rounded-2xl border-dashed border-2 border-white/10">
            <div className="text-center">
              <LayoutList className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium text-white">List View Coming Soon</p>
              <p className="text-sm">We are optimizing the table experience for you.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
