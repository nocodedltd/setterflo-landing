import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function ToneSettings() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Personality Sliders */}
      <Card className="glass-panel">
        <CardHeader className="border-b border-white/[0.06] bg-white/[0.02]">
          <CardTitle>Voice Personality</CardTitle>
        </CardHeader>
        <CardContent className="space-y-10 pt-8">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-sm font-medium text-white">Formality</label>
              <span className="text-xs font-bold text-primary-400 bg-primary/10 px-2 py-0.5 rounded">Casual</span>
            </div>
            <input type="range" className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary-400" min="1" max="5" defaultValue="2" />
            <div className="flex justify-between text-[10px] uppercase font-bold text-text-muted tracking-wider">
              <span>Professional</span>
              <span>Casual</span>
            </div>
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-end">
              <label className="text-sm font-medium text-white">Enthusiasm</label>
              <span className="text-xs font-bold text-primary-400 bg-primary/10 px-2 py-0.5 rounded">Moderate</span>
            </div>
            <input type="range" className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary-400" min="1" max="5" defaultValue="3" />
             <div className="flex justify-between text-[10px] uppercase font-bold text-text-muted tracking-wider">
              <span>Calm</span>
              <span>High Energy</span>
            </div>
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-end">
              <label className="text-sm font-medium text-white">Emoji Usage</label>
              <span className="text-xs font-bold text-primary-400 bg-primary/10 px-2 py-0.5 rounded">Some emojis</span>
            </div>
            <input type="range" className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary-400" min="1" max="5" defaultValue="3" />
             <div className="flex justify-between text-[10px] uppercase font-bold text-text-muted tracking-wider">
              <span>None</span>
              <span>Heavy</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Context & Examples */}
      <div className="space-y-6">
        <Card className="glass-panel">
          <CardHeader className="border-b border-white/[0.06] bg-white/[0.02]">
            <CardTitle>Communication Context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Your Niche / Who you help</label>
              <input 
                type="text" 
                className="w-full bg-black/20 border border-white/[0.1] rounded-lg px-4 py-3 text-white text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50 transition-all"
                defaultValue="Business coaching for 6-figure entrepreneurs"
              />
            </div>
            
            <div className="space-y-2">
               <label className="text-sm font-medium text-text-secondary">Example Phrase (AI will mimic this style)</label>
               <textarea 
                className="w-full bg-black/20 border border-white/[0.1] rounded-lg px-4 py-3 text-white text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50 transition-all min-h-[100px] leading-relaxed"
                defaultValue="Hey! Yeah I totally get that struggle. It's super common actually. What have you tried so far?"
              />
            </div>

            <Button className="w-full bg-primary hover:bg-primary-600 text-white shadow-lg shadow-primary/20 h-11">
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
