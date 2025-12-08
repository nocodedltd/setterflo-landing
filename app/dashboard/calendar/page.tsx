import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar as CalendarIcon, Clock, Video, MoreHorizontal, Plus, Link as LinkIcon, Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const bookings = [
  {
    id: 1,
    lead: "Alex Johnson",
    handle: "@alex_johnson",
    date: "Today",
    fullDate: "Dec 8",
    time: "2:00 PM - 2:30 PM",
    type: "Discovery Call",
    platform: "Google Meet",
    status: "confirmed"
  },
  {
    id: 2,
    lead: "Sarah Matthews",
    handle: "@sarah_coach",
    date: "Tomorrow",
    fullDate: "Dec 9",
    time: "10:00 AM - 10:30 AM",
    type: "Strategy Session",
    platform: "Zoom",
    status: "confirmed"
  },
   {
    id: 3,
    lead: "Mike Ross",
    handle: "@mike_law",
    date: "Wednesday",
    fullDate: "Dec 11",
    time: "4:00 PM - 4:45 PM",
    type: "Follow Up",
    platform: "Zoom",
    status: "pending"
  }
];

export default function CalendarPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.06]">
        <div className="space-y-2">
          <h1 className="text-3xl font-heading font-bold text-white tracking-tight flex items-center gap-3">
            <CalendarIcon className="h-8 w-8 text-primary-400" />
            Calendar & Bookings
          </h1>
          <p className="text-text-secondary max-w-lg">
            Manage your upcoming calls and calendar integrations.
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary-600 text-white gap-2 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" />
          Add Booking
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Calendar Timeline */}
        <div className="lg:col-span-2 space-y-6">
           <Card className="glass-panel h-full min-h-[500px]">
             <CardHeader className="border-b border-white/[0.06] bg-white/[0.02] flex flex-row items-center justify-between">
               <CardTitle>Upcoming Schedule</CardTitle>
               <Button variant="ghost" size="sm" className="text-primary-400 hover:text-white">View Full Calendar</Button>
             </CardHeader>
             <CardContent className="p-0">
                <div className="divide-y divide-white/[0.06]">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 hover:bg-white/[0.02] transition-colors group">
                       {/* Date Box */}
                       <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/[0.1] text-center shadow-inner">
                          <span className="text-[10px] text-primary-400 font-bold uppercase tracking-wider">{booking.date}</span>
                          <span className="text-xl font-bold text-white">{booking.fullDate.split(' ')[1]}</span>
                       </div>
                       
                       {/* Details */}
                       <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                             <h4 className="font-bold text-lg text-white truncate">{booking.type}</h4>
                             <span className={cn(
                               "px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border",
                               booking.status === 'confirmed' 
                                 ? "bg-success-500/10 text-success-500 border-success-500/20" 
                                 : "bg-warning-500/10 text-warning-500 border-warning-500/20"
                             )}>
                               {booking.status}
                             </span>
                          </div>
                          <p className="text-sm text-text-secondary">with <span className="text-white font-medium">{booking.lead}</span> <span className="text-text-muted">({booking.handle})</span></p>
                          
                          <div className="flex items-center gap-4 pt-1 text-xs font-medium text-text-muted">
                             <div className="flex items-center gap-1.5 bg-white/[0.03] px-2 py-1 rounded border border-white/[0.05]">
                               <Clock className="h-3 w-3 text-primary-400" />
                               {booking.time}
                             </div>
                             <div className="flex items-center gap-1.5 bg-white/[0.03] px-2 py-1 rounded border border-white/[0.05]">
                               <Video className="h-3 w-3 text-accent-purple-400" />
                               {booking.platform}
                             </div>
                          </div>
                       </div>
                       
                       {/* Actions */}
                       <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity sm:ml-auto">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/5 hover:bg-white/10 hover:text-white">
                             <LinkIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/5 hover:bg-white/10 hover:text-white">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                       </div>
                    </div>
                  ))}
                </div>
             </CardContent>
           </Card>
        </div>

        {/* Sidebar: Connected Calendars */}
        <div className="space-y-6">
          <Card className="glass-panel">
            <CardHeader className="border-b border-white/[0.06] bg-white/[0.02]">
              <CardTitle>Integrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {/* Connected State */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-success-500/20 bg-success-500/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-success-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="h-10 w-10 rounded-lg bg-white text-black font-bold flex items-center justify-center shadow-lg">C</div>
                  <div>
                    <p className="text-sm font-bold text-white">Cal.com</p>
                    <p className="text-xs text-success-500 flex items-center gap-1 font-medium">
                      <Check className="h-3 w-3" /> Connected
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-text-muted hover:text-white relative z-10">Manage</Button>
              </div>

              {/* Not Connected State */}
               <div className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] opacity-70 hover:opacity-100 transition-all">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-500 text-white font-bold flex items-center justify-center shadow-lg">G</div>
                  <div>
                    <p className="text-sm font-bold text-white">Google Calendar</p>
                    <p className="text-xs text-text-muted">Not Connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-xs border-white/[0.1] h-8 bg-transparent hover:bg-white/5">Connect</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="border-b border-white/[0.06] bg-white/[0.02]">
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 p-6">
               <div className="space-y-2">
                 <label className="text-sm font-medium text-text-secondary">Booking Buffer</label>
                 <div className="relative">
                   <select className="w-full bg-black/20 border border-white/[0.1] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500 appearance-none">
                     <option>15 minutes</option>
                     <option>30 minutes</option>
                     <option>1 hour</option>
                   </select>
                   <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted rotate-90 pointer-events-none" />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-text-secondary">Minimum Notice</label>
                 <div className="relative">
                    <select className="w-full bg-black/20 border border-white/[0.1] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500 appearance-none">
                      <option>24 hours</option>
                      <option>48 hours</option>
                      <option>7 days</option>
                    </select>
                    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted rotate-90 pointer-events-none" />
                 </div>
               </div>
               <Button className="w-full bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.05] mt-2">
                 Save Preferences
               </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
