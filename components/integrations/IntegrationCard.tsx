'use client';

import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, AlertCircle, Clock, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export type IntegrationStatus = 'connected' | 'disconnected' | 'pending' | 'error';
export type IntegrationType = 'crm' | 'calendar' | 'instagram' | 'automation' | 'database';

interface IntegrationCardProps {
  name: string;
  description: string;
  logo: ReactNode;
  status: IntegrationStatus;
  type: IntegrationType;
  connectedAccount?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onConfigure?: () => void;
  isPremium?: boolean;
  comingSoon?: boolean;
  features?: string[];
}

export function IntegrationCard({
  name,
  description,
  logo,
  status,
  type,
  connectedAccount,
  onConnect,
  onDisconnect,
  onConfigure,
  isPremium,
  comingSoon,
  features,
}: IntegrationCardProps) {
  const typeColors: Record<IntegrationType, string> = {
    crm: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    calendar: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    instagram: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    automation: 'bg-green-500/10 text-green-400 border-green-500/20',
    database: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  };

  const statusConfig = {
    connected: {
      icon: CheckCircle,
      text: 'Connected',
      color: 'text-success-500',
      bg: 'bg-success-500/10',
      border: 'border-success-500/20',
    },
    disconnected: {
      icon: AlertCircle,
      text: 'Not Connected',
      color: 'text-text-muted',
      bg: 'bg-white/5',
      border: 'border-white/10',
    },
    pending: {
      icon: Clock,
      text: 'Pending',
      color: 'text-warning-500',
      bg: 'bg-warning-500/10',
      border: 'border-warning-500/20',
    },
    error: {
      icon: AlertCircle,
      text: 'Error',
      color: 'text-error-500',
      bg: 'bg-error-500/10',
      border: 'border-error-500/20',
    },
  };

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  return (
    <Card 
      className={cn(
        "glass-panel border-white/[0.08] hover:border-primary/30 transition-all group relative overflow-hidden",
        status === 'connected' && "border-success-500/20",
        comingSoon && "opacity-60 cursor-not-allowed"
      )}
    >
      <CardContent className="p-6 space-y-4 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="h-12 w-12 rounded-xl flex items-center justify-center shadow-lg bg-black/40 border border-white/10">
            {logo}
          </div>
          <div className="flex gap-2">
            <span className={cn("px-2 py-1 rounded-md text-xs border font-medium", typeColors[type])}>
              {type}
            </span>
            {isPremium && (
              <span className="px-2 py-1 rounded-md bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary-400 text-xs border border-primary/20 font-bold">
                PRO
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-lg">{name}</h3>
            {!comingSoon && (
              <div className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border",
                currentStatus.bg,
                currentStatus.border,
                currentStatus.color
              )}>
                <StatusIcon className="h-3 w-3" />
                {currentStatus.text}
              </div>
            )}
          </div>
          
          <p className="text-sm text-text-secondary">{description}</p>

          {connectedAccount && status === 'connected' && (
            <p className="text-xs text-primary-400 font-medium flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Connected as: {connectedAccount}
            </p>
          )}

          {features && features.length > 0 && (
            <ul className="space-y-1 pt-2">
              {features.map((feature, i) => (
                <li key={i} className="text-xs text-text-muted flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-primary-400" />
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {comingSoon ? (
            <Button 
              variant="outline" 
              className="w-full border-white/10 text-text-muted cursor-not-allowed"
              disabled
            >
              Coming Soon
            </Button>
          ) : status === 'connected' ? (
            <>
              {onConfigure && (
                <Button
                  variant="outline"
                  className="flex-1 border-white/10 hover:bg-white/5 hover:text-white"
                  onClick={onConfigure}
                >
                  Configure
                </Button>
              )}
              {onDisconnect && (
                <Button
                  variant="outline"
                  className="flex-1 border-error-500/20 text-error-500 hover:bg-error-500/10"
                  onClick={onDisconnect}
                >
                  Disconnect
                </Button>
              )}
            </>
          ) : (
            <Button 
              className="w-full bg-primary hover:bg-primary-600 text-white shadow-lg shadow-primary/20 group"
              onClick={onConnect}
              disabled={comingSoon}
            >
              <span className="flex items-center gap-2">
                Connect {name}
                <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </Button>
          )}
        </div>

        {status === 'error' && (
          <div className="p-3 rounded-lg bg-error-500/5 border border-error-500/20 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-error-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-error-400">
              Connection error. Please reconnect or contact support if the issue persists.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
