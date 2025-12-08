"use client";

import { Bell, ChevronDown, Instagram, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function TopBar() {
  return (
    <header className="h-18 border-b border-white/[0.06] bg-[#050A14]/80 backdrop-blur-xl sticky top-0 z-40 px-8 flex items-center justify-between ml-64">
      {/* Left: Context / Search */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1] transition-colors cursor-pointer group">
          <div className="p-1 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500">
            <div className="bg-black rounded-full p-0.5">
              <Instagram className="h-3 w-3 text-white" />
            </div>
          </div>
          <span className="text-sm font-medium text-white group-hover:text-primary-400 transition-colors">@nocoded.ai</span>
          <ChevronDown className="h-3 w-3 text-text-muted" />
        </div>
        
        {/* Quick Search Placeholder */}
        <div className="hidden lg:flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors cursor-text">
          <Search className="h-4 w-4" />
          <span>Type / to search...</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Quick Stats Mini-Bar */}
        <div className="hidden xl:flex items-center gap-6 mr-4 px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.04]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success-500 animate-pulse" />
            <span className="text-xs font-medium text-text-secondary">System Operational</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex gap-2 text-xs">
            <span className="text-text-muted">Credits:</span>
            <span className="text-white font-medium">2,450 / 5,000</span>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="relative text-text-secondary hover:text-white hover:bg-white/[0.05]">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-error-500 rounded-full border-2 border-[#050A14]" />
        </Button>
      </div>
    </header>
  );
}
