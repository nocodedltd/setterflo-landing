"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { IntegrationCard } from "@/components/integrations/IntegrationCard";
import { 
  User, CreditCard, Bell, Users, Shield, Instagram, Zap, Database, 
  Link as LinkIcon, CheckCircle, AlertCircle, ChevronRight, Calendar,
  Mail, Phone, MessageSquare, Target, FileText, Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SetupChecklist } from "@/components/settings/SetupChecklist";

const tabs = [
  { id: "account", label: "Account", icon: User },
  { id: "integrations", label: "Integrations", icon: LinkIcon },
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "automation", label: "Automation", icon: Zap, warning: true },
  { id: "team", label: "Team", icon: Users },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("integrations");

  return (
    <div className="space-y-8 flex flex-col h-full animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.06]">
        <div className="space-y-2">
          <h1 className="text-3xl font-heading font-bold text-white tracking-tight">Settings</h1>
          <p className="text-text-secondary max-w-lg">
            Manage your profile, integrations, and system configurations.
          </p>
        </div>
      </div>

      {/* Setup Checklist */}
      <SetupChecklist />

      <div className="flex flex-col lg:flex-row gap-8 h-full">
        {/* Settings Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <nav className="space-y-1 sticky top-24">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary-400 shadow-sm border border-primary/10"
                    : "text-text-secondary hover:bg-white/[0.03] hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? "text-primary-400" : "text-text-muted group-hover:text-white")} />
                  {tab.label}
                </div>
                {tab.warning && (
                  <div className="h-2 w-2 rounded-full bg-warning-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 space-y-6">
          {activeTab === "integrations" && (
            <div className="space-y-8 animate-fade-in">
              {/* Instagram Section */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Instagram className="h-5 w-5 text-pink-400" />
                    Instagram
                  </h2>
                  <p className="text-sm text-text-secondary mt-1">
                    Connect your Instagram Business or Creator accounts for DM automation
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <IntegrationCard
                    name="Instagram Business"
                    description="Automate DMs, qualify leads, and book calls automatically"
                    logo={<Instagram className="h-6 w-6 text-pink-400" />}
                    status="connected"
                    type="instagram"
                    connectedAccount="@nocoded.ai"
                    features={[
                      "Automated DM responses",
                      "Lead qualification",
                      "Call booking integration",
                    ]}
                    onConfigure={() => setActiveTab("instagram")}
                    onDisconnect={() => console.log("Disconnect Instagram")}
                  />
                  <IntegrationCard
                    name="Instagram Creator"
                    description="Add another Instagram account for multi-account management"
                    logo={<Instagram className="h-6 w-6 text-purple-400" />}
                    status="disconnected"
                    type="instagram"
                    onConnect={() => console.log("Connect Instagram")}
                  />
                </div>
              </div>

              {/* CRM Section */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-400" />
                    Customer Relationship Management (CRM)
                  </h2>
                  <p className="text-sm text-text-secondary mt-1">
                    Sync leads and opportunities to your CRM automatically
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <IntegrationCard
                    name="GoHighLevel"
                    description="Sync leads, opportunities, and conversations"
                    logo={<div className="text-blue-600 font-bold text-lg">GHL</div>}
                    status="disconnected"
                    type="crm"
                    features={[
                      "Automatic lead creation",
                      "Pipeline sync",
                      "Tag automation",
                    ]}
                    onConnect={() => console.log("Connect GHL")}
                  />
                  <IntegrationCard
                    name="HubSpot"
                    description="Sync contacts and deals to HubSpot CRM"
                    logo={<div className="text-orange-500 font-bold text-lg">HS</div>}
                    status="disconnected"
                    type="crm"
                    onConnect={() => console.log("Connect HubSpot")}
                  />
                  <IntegrationCard
                    name="Pipedrive"
                    description="Create deals and sync conversation notes"
                    logo={<Target className="h-6 w-6 text-green-500" />}
                    status="disconnected"
                    type="crm"
                    onConnect={() => console.log("Connect Pipedrive")}
                  />
                  <IntegrationCard
                    name="ActiveCampaign"
                    description="Sync contacts and trigger automation workflows"
                    logo={<Mail className="h-6 w-6 text-blue-400" />}
                    status="disconnected"
                    type="crm"
                    onConnect={() => console.log("Connect ActiveCampaign")}
                  />
                  <IntegrationCard
                    name="Salesforce"
                    description="Enterprise CRM integration for large teams"
                    logo={<div className="text-blue-500 font-bold text-lg">SF</div>}
                    status="disconnected"
                    type="crm"
                    isPremium
                    onConnect={() => console.log("Connect Salesforce")}
                  />
                  <IntegrationCard
                    name="Custom CRM"
                    description="Connect via API or Zapier webhook"
                    logo={<Database className="h-6 w-6 text-purple-400" />}
                    status="disconnected"
                    type="crm"
                    comingSoon
                  />
                </div>
              </div>

              {/* Calendar Section */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-400" />
                    Calendar & Booking
                  </h2>
                  <p className="text-sm text-text-secondary mt-1">
                    Let qualified leads book calls directly from Instagram DMs
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <IntegrationCard
                    name="Calendly"
                    description="Share your Calendly link for instant booking"
                    logo={<Calendar className="h-6 w-6 text-blue-500" />}
                    status="disconnected"
                    type="calendar"
                    features={[
                      "Automatic link sharing",
                      "Event type selection",
                      "Buffer time management",
                    ]}
                    onConnect={() => console.log("Connect Calendly")}
                  />
                  <IntegrationCard
                    name="Cal.com"
                    description="Open-source scheduling with full customization"
                    logo={<Calendar className="h-6 w-6 text-green-500" />}
                    status="disconnected"
                    type="calendar"
                    onConnect={() => console.log("Connect Cal.com")}
                  />
                  <IntegrationCard
                    name="Google Calendar"
                    description="Check availability and create events"
                    logo={<Calendar className="h-6 w-6 text-red-500" />}
                    status="disconnected"
                    type="calendar"
                    onConnect={() => console.log("Connect Google Calendar")}
                  />
                  <IntegrationCard
                    name="Microsoft Bookings"
                    description="Integrate with Microsoft 365 calendar"
                    logo={<Calendar className="h-6 w-6 text-blue-600" />}
                    status="disconnected"
                    type="calendar"
                    onConnect={() => console.log("Connect MS Bookings")}
                  />
                  <IntegrationCard
                    name="Acuity Scheduling"
                    description="Advanced scheduling with payment options"
                    logo={<Calendar className="h-6 w-6 text-purple-500" />}
                    status="disconnected"
                    type="calendar"
                    isPremium
                    onConnect={() => console.log("Connect Acuity")}
                  />
                </div>
              </div>

              {/* Automation & Data Section */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    Automation & Data
                  </h2>
                  <p className="text-sm text-text-secondary mt-1">
                    Export data and connect to other automation tools
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <IntegrationCard
                    name="Airtable"
                    description="Export conversations and leads to Airtable"
                    logo={<Database className="h-6 w-6 text-yellow-500" />}
                    status="disconnected"
                    type="database"
                    onConnect={() => console.log("Connect Airtable")}
                  />
                  <IntegrationCard
                    name="Google Sheets"
                    description="Sync lead data to spreadsheets automatically"
                    logo={<FileText className="h-6 w-6 text-green-600" />}
                    status="disconnected"
                    type="database"
                    onConnect={() => console.log("Connect Google Sheets")}
                  />
                  <IntegrationCard
                    name="Zapier"
                    description="Connect to 5000+ apps via Zapier webhooks"
                    logo={<Zap className="h-6 w-6 text-orange-500" />}
                    status="disconnected"
                    type="automation"
                    onConnect={() => console.log("Connect Zapier")}
                  />
                  <IntegrationCard
                    name="Make (Integromat)"
                    description="Advanced workflow automation platform"
                    logo={<Zap className="h-6 w-6 text-purple-500" />}
                    status="disconnected"
                    type="automation"
                    onConnect={() => console.log("Connect Make")}
                  />
                  <IntegrationCard
                    name="Webhook"
                    description="Send data to custom endpoints via webhooks"
                    logo={<LinkIcon className="h-6 w-6 text-blue-400" />}
                    status="disconnected"
                    type="automation"
                    onConnect={() => console.log("Setup Webhook")}
                  />
                </div>
              </div>

              {/* Communication Section */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-green-400" />
                    Communication
                  </h2>
                  <p className="text-sm text-text-secondary mt-1">
                    Get notifications and sync conversations across platforms
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <IntegrationCard
                    name="Slack"
                    description="Get real-time notifications in Slack"
                    logo={<MessageSquare className="h-6 w-6 text-purple-600" />}
                    status="disconnected"
                    type="automation"
                    onConnect={() => console.log("Connect Slack")}
                  />
                  <IntegrationCard
                    name="Discord"
                    description="Receive alerts in your Discord server"
                    logo={<MessageSquare className="h-6 w-6 text-indigo-500" />}
                    status="disconnected"
                    type="automation"
                    onConnect={() => console.log("Connect Discord")}
                  />
                  <IntegrationCard
                    name="SMS / Twilio"
                    description="Send SMS notifications for high-value leads"
                    logo={<Phone className="h-6 w-6 text-red-500" />}
                    status="disconnected"
                    type="automation"
                    isPremium
                    onConnect={() => console.log("Connect Twilio")}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "account" && (
            <div className="space-y-6 animate-fade-in">
              <Card className="glass-panel border-white/[0.08]">
                <CardHeader className="border-b border-white/[0.06] pb-4">
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Full Name</label>
                      <input type="text" defaultValue="Charlie Lefever" className="w-full bg-black/20 border border-white/[0.1] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Email</label>
                      <input type="email" defaultValue="charlie@nocoded.co.uk" className="w-full bg-black/20 border border-white/[0.1] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Phone</label>
                      <input type="tel" defaultValue="+66 XX XXX XXXX" className="w-full bg-black/20 border border-white/[0.1] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Timezone</label>
                      <div className="relative">
                        <select className="w-full bg-black/20 border border-white/[0.1] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all appearance-none">
                          <option>Asia/Bangkok (GMT+7)</option>
                          <option>Europe/London (GMT+0)</option>
                          <option>America/New_York (GMT-5)</option>
                        </select>
                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted rotate-90 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button className="bg-primary hover:bg-primary-600 text-white shadow-lg shadow-primary/20">Save Changes</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border-white/[0.08]">
                <CardHeader className="border-b border-white/[0.06] pb-4">
                  <CardTitle>Business Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Business Name</label>
                      <input type="text" defaultValue="SetterFlo" className="w-full bg-black/20 border border-white/[0.1] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all" />
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Website</label>
                      <input type="url" defaultValue="https://setterflo.nocoded.ai" className="w-full bg-black/20 border border-white/[0.1] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "instagram" && (
            <Card className="glass-panel border-white/[0.08] animate-fade-in">
              <CardHeader className="border-b border-white/[0.06] pb-4">
                <CardTitle>Connected Accounts</CardTitle>
                <CardDescription>Manage your Instagram connections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center justify-between p-4 rounded-xl border border-success-500/20 bg-success-500/5 relative overflow-hidden">
                  <div className="flex items-center gap-4 relative z-10">
                     <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-0.5 shadow-lg">
                       <div className="h-full w-full rounded-full bg-black flex items-center justify-center">
                         <Instagram className="h-6 w-6 text-white" />
                       </div>
                     </div>
                     <div>
                       <p className="font-bold text-white text-lg">@nocoded.ai</p>
                       <p className="text-xs text-success-500 flex items-center gap-1.5 font-medium uppercase tracking-wide mt-0.5">
                         <CheckCircle className="h-3 w-3" />
                         Active & Listening
                       </p>
                     </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/10 text-text-muted hover:text-error-500 hover:border-error-500/50 hover:bg-error-500/10 bg-transparent relative z-10">Disconnect</Button>
                </div>
                
                <Button variant="outline" className="w-full border-dashed border-white/10 text-text-muted hover:text-white hover:border-primary/50 hover:bg-primary/5 py-8 h-auto flex flex-col gap-2">
                  <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                    <Instagram className="h-5 w-5" />
                  </div>
                  <span>Connect Another Account</span>
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "automation" && (
            <div className="space-y-6 animate-fade-in">
              {/* Misconfiguration Alert */}
              <div className="p-4 rounded-xl border border-warning-500/20 bg-warning-500/5 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-warning-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-warning-500">Automation Safety Warning</h4>
                  <p className="text-xs text-text-secondary mt-1">Rate limits have not been configured for the new account. We&apos;ve applied conservative defaults.</p>
                </div>
                <Button size="sm" variant="outline" className="ml-auto border-warning-500/20 text-warning-500 hover:bg-warning-500/10 h-8">Fix</Button>
              </div>

              <Card className="glass-panel border-white/[0.08]">
                <CardHeader className="border-b border-white/[0.06] pb-4">
                  <CardTitle>Global Controls</CardTitle>
                  <CardDescription>Master switches for your AI agents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-primary/20 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">AI Inbound Handler</span>
                        <span className="px-2 py-0.5 rounded-full bg-success-500/10 text-success-500 text-[10px] uppercase font-bold tracking-wider border border-success-500/20">Active</span>
                      </div>
                      <p className="text-sm text-text-secondary">Automatically respond to new DMs and comments</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-primary/20 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">Outbound Campaigns</span>
                        <span className="px-2 py-0.5 rounded-full bg-success-500/10 text-success-500 text-[10px] uppercase font-bold tracking-wider border border-success-500/20">Active</span>
                      </div>
                      <p className="text-sm text-text-secondary">Send messages for active campaigns</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border-white/[0.08]">
                <CardHeader className="border-b border-white/[0.06] pb-4">
                  <CardTitle>Safety & Whitelist</CardTitle>
                  <CardDescription>Manage exclusions and rate limits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                   <div className="space-y-3">
                     <label className="text-sm font-medium text-white">Blacklisted Usernames</label>
                     <textarea 
                        className="w-full bg-black/20 border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all min-h-[100px]"
                        placeholder="@username1, @username2 (one per line or comma separated)"
                     />
                     <p className="text-xs text-text-muted">AI will never reply to these accounts.</p>
                   </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Placeholders for other tabs */}
          {['team', 'billing', 'notifications'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-[400px] text-text-muted glass-panel rounded-2xl border-dashed border-2 border-white/10 animate-fade-in">
              <Shield className="h-12 w-12 mb-4 opacity-20" />
              <p>This section is coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
