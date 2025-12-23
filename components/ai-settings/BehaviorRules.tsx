import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";

export function BehaviorRules() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-background-secondary/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Post-Booking Behavior</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium text-white">Turn off AI after booking</label>
              <p className="text-xs text-text-muted">Switch to manual mode once a call is booked</p>
            </div>
            <Switch defaultChecked={false} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium text-white">Send calendar reminders</label>
              <p className="text-xs text-text-muted">AI will nudge leads before the call</p>
            </div>
            <Switch defaultChecked={true} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-background-secondary/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Response Timing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white">Response Delay</span>
              <span className="text-primary-400">2-8 seconds</span>
            </div>
            <input type="range" className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary-500" min="1" max="60" defaultValue="5" />
             <p className="text-xs text-text-muted">Adds a human-like delay before sending messages</p>
          </div>
          
           <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium text-white">Batch messages</label>
              <p className="text-xs text-text-muted">Wait 60s to group multiple messages</p>
            </div>
            <Switch defaultChecked={true} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-background-secondary/30 backdrop-blur-sm lg:col-span-2">
        <CardHeader>
          <CardTitle>Objection Handling</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background/50">
              <span className="text-sm text-white">Handle &quot;Too Expensive&quot;</span>
              <Switch defaultChecked={true} />
            </div>
            <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background/50">
              <span className="text-sm text-white">Handle &quot;Need to think about it&quot;</span>
              <Switch defaultChecked={true} />
            </div>
            <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background/50">
              <span className="text-sm text-white">Handle &quot;Already have a coach&quot;</span>
              <Switch defaultChecked={true} />
            </div>
             <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background/50">
              <span className="text-sm text-white">Handle &quot;Send me info&quot;</span>
              <Switch defaultChecked={true} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="lg:col-span-2 flex justify-end">
          <Button className="bg-primary-600 hover:bg-primary-700 text-white">
              Save All Rules
            </Button>
      </div>
    </div>
  );
}
