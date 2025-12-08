import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Play, Pause, AlertCircle, CheckCircle, Activity, RotateCw, ExternalLink, Box } from "lucide-react";
import { cn } from "@/lib/utils";

const workflows = [
  {
    id: 1,
    name: "Instagram Inbound Handler",
    type: "inbound",
    status: "active",
    lastRun: "8 seconds ago",
    today: 247,
    errors: 0,
    health: 100
  },
  {
    id: 2,
    name: "Calendar Booking System",
    type: "booking",
    status: "active",
    lastRun: "12 minutes ago",
    today: 8,
    errors: 0,
    health: 100
  },
  {
    id: 3,
    name: "Outbound: Health Coaches",
    type: "campaign",
    status: "active",
    lastRun: "3 minutes ago",
    today: 15,
    errors: 0,
    health: 98
  },
  {
    id: 4,
    name: "Lead Qualification Scraper",
    type: "enrichment",
    status: "paused",
    lastRun: "Yesterday",
    today: 0,
    errors: 0,
    health: 100
  }
];

export default function WorkflowsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.06]">
        <div className="space-y-2">
          <h1 className="text-3xl font-heading font-bold text-white tracking-tight flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary-400" />
            System Status
          </h1>
          <p className="text-text-secondary max-w-lg">
            Monitor the health and performance of your n8n automation workflows.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-success-500/10 text-success-500 rounded-full text-xs font-bold border border-success-500/20 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500"></span>
            </span>
            ALL SYSTEMS OPERATIONAL
          </div>
          <Button variant="outline" size="icon" className="border-white/[0.06] bg-white/[0.03] text-text-secondary hover:text-white">
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* System Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card hover:bg-blue-500/5 hover:border-blue-500/20">
          <CardContent className="p-6 flex items-center gap-5">
             <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-lg shadow-blue-500/10">
               <Activity className="h-6 w-6" />
             </div>
             <div>
               <p className="text-sm font-medium text-text-muted">API Latency</p>
               <p className="text-2xl font-bold text-white tracking-tight">42ms</p>
             </div>
          </CardContent>
        </Card>
        <Card className="glass-card hover:bg-purple-500/5 hover:border-purple-500/20">
          <CardContent className="p-6 flex items-center gap-5">
             <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 shadow-lg shadow-purple-500/10">
               <CheckCircle className="h-6 w-6" />
             </div>
             <div>
               <p className="text-sm font-medium text-text-muted">Success Rate</p>
               <p className="text-2xl font-bold text-white tracking-tight">99.9%</p>
             </div>
          </CardContent>
        </Card>
        <Card className="glass-card hover:bg-orange-500/5 hover:border-orange-500/20">
          <CardContent className="p-6 flex items-center gap-5">
             <div className="h-12 w-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shadow-lg shadow-orange-500/10">
               <Box className="h-6 w-6" />
             </div>
             <div>
               <p className="text-sm font-medium text-text-muted">IG Rate Limit</p>
               <p className="text-2xl font-bold text-white tracking-tight">80% Free</p>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white px-1">Active Workflows</h3>
        <div className="grid gap-4">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300">
              <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1 transition-all duration-300",
                workflow.status === 'active' ? "bg-success-500 group-hover:w-1.5" : "bg-warning-500 group-hover:w-1.5"
              )} />
              
              <div className="p-6 flex flex-col md:flex-row items-center gap-6 pl-8">
                {/* Info */}
                <div className="flex-1 space-y-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <h3 className="font-bold text-white text-lg">{workflow.name}</h3>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border",
                      workflow.status === 'active' 
                        ? "bg-success-500/10 text-success-500 border-success-500/20" 
                        : "bg-warning-500/10 text-warning-500 border-warning-500/20"
                    )}>
                      {workflow.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-text-secondary pt-1">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 opacity-70" /> 
                      Last run: <span className="text-white font-medium">{workflow.lastRun}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5 opacity-70" />
                      Processed: <span className="text-white font-medium">{workflow.today}</span>
                    </span>
                    {workflow.errors > 0 ? (
                      <span className="text-error-500 flex items-center gap-1.5 font-medium">
                        <AlertCircle className="h-3.5 w-3.5" /> {workflow.errors} errors
                      </span>
                    ) : (
                      <span className="text-success-500 flex items-center gap-1.5 font-medium">
                        <CheckCircle className="h-3.5 w-3.5" /> Healthy
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                   <Button variant="ghost" size="sm" className="text-text-muted hover:text-white hover:bg-white/10">
                    View Logs
                   </Button>
                   <Button variant="outline" size="sm" className="border-white/[0.1] text-text-secondary hover:text-white hover:border-white/20 gap-2 bg-transparent">
                     <ExternalLink className="h-3 w-3" />
                     Edit in n8n
                   </Button>
                   <div className="w-px h-6 bg-white/[0.1] mx-1" />
                   {workflow.status === 'active' ? (
                     <Button size="icon" variant="ghost" className="text-warning-500 hover:text-warning-400 hover:bg-warning-500/10 rounded-full">
                       <Pause className="h-4 w-4" />
                     </Button>
                   ) : (
                     <Button size="icon" variant="ghost" className="text-success-500 hover:text-success-400 hover:bg-success-500/10 rounded-full">
                       <Play className="h-4 w-4" />
                     </Button>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
