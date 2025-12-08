"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Rocket,
  Bot,
  Calendar,
  BarChart3,
  Settings,
  ChevronRight,
  Sparkles
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Leads & CRM", href: "/dashboard/leads", icon: Users },
  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Rocket },
  { name: "AI Settings", href: "/dashboard/ai-settings", icon: Bot },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#050A14] border-r border-white/[0.06] flex flex-col z-50">
      {/* Brand */}
      <div className="h-18 flex items-center px-6 border-b border-white/[0.06]">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
            <span className="text-white font-bold font-heading">S</span>
          </div>
          <span className="font-heading font-bold text-lg text-white tracking-tight">
            SetterFlo
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-0.5 overflow-y-auto no-scrollbar">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden",
                isActive
                  ? "bg-primary/10 text-primary-400"
                  : "text-text-secondary hover:text-white hover:bg-white/[0.03]"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
              )}
              <item.icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  isActive ? "text-primary-400" : "text-text-muted group-hover:text-white"
                )}
              />
              <span className="flex-1">{item.name}</span>
              {isActive && <ChevronRight className="h-3 w-3 opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-white/[0.06] bg-black/20">
        <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer group">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center text-xs font-medium text-white shadow-inner">
            CL
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate group-hover:text-primary-400 transition-colors">Charlie Lefever</p>
            <div className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-accent-purple-400" />
              <p className="text-xs text-text-muted truncate">Pro Plan</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
