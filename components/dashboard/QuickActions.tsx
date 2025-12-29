'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Instagram, Calendar, Zap, MessageSquare, Target, Settings, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  badge?: string;
}

const actions: QuickAction[] = [
  {
    title: 'Connect Instagram',
    description: 'Add your first account',
    icon: <Instagram className="h-5 w-5" />,
    href: '/dashboard/settings?tab=integrations',
    color: 'from-pink-500 to-purple-500',
    badge: 'Setup',
  },
  {
    title: 'Setup Calendar',
    description: 'Enable auto-booking',
    icon: <Calendar className="h-5 w-5" />,
    href: '/dashboard/settings?tab=integrations',
    color: 'from-blue-500 to-cyan-500',
    badge: 'Setup',
  },
  {
    title: 'View Messages',
    description: 'Check recent DMs',
    icon: <MessageSquare className="h-5 w-5" />,
    href: '/dashboard/messages',
    color: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Create Campaign',
    description: 'Start outreach',
    icon: <Target className="h-5 w-5" />,
    href: '/dashboard/campaigns',
    color: 'from-orange-500 to-red-500',
  },
  {
    title: 'Configure AI',
    description: 'Tune your agent',
    icon: <Zap className="h-5 w-5" />,
    href: '/dashboard/ai-settings',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    title: 'View Analytics',
    description: 'Track performance',
    icon: <TrendingUp className="h-5 w-5" />,
    href: '/dashboard/analytics',
    color: 'from-purple-500 to-pink-500',
  },
];

export function QuickActions() {
  return (
    <Card className="glass-panel border-white/[0.08]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Quick Actions</h3>
            <p className="text-sm text-text-secondary mt-1">Get started with common tasks</p>
          </div>
          <Link href="/dashboard/settings">
            <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
              <Settings className="h-4 w-4 mr-2" />
              All Settings
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={action.href}>
                <div className="group relative p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-primary/30 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer overflow-hidden">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {action.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-white text-sm group-hover:text-primary-400 transition-colors">
                          {action.title}
                        </h4>
                        {action.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary-400 border border-primary/20">
                            {action.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">{action.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
