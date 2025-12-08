import { Card, CardContent } from "@/components/ui/Card";
import { CheckCircle2, Circle, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

type StepStatus = "completed" | "current" | "pending";

interface Step {
  id: string;
  label: string;
  description: string;
  status: StepStatus;
}

const steps: Step[] = [
  { id: "ig", label: "Connect Instagram", description: "Link your professional account", status: "completed" },
  { id: "cal", label: "Connect Calendar", description: "Set up booking integration", status: "completed" },
  { id: "ai", label: "Configure AI Tone", description: "Define your voice & style", status: "current" },
  { id: "auto", label: "Enable Automation", description: "Turn on the AI setter", status: "pending" },
];

export function SetupChecklist() {
  const currentStepIndex = steps.findIndex(s => s.status === "current");
  const progress = Math.round((steps.filter(s => s.status === "completed").length / steps.length) * 100);

  return (
    <Card className="glass-panel border-primary/20 bg-gradient-to-r from-primary/5 to-transparent relative overflow-hidden mb-8">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      
      <CardContent className="p-6 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Progress Info */}
          <div className="space-y-2 min-w-[200px]">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary-400" />
              <h3 className="font-bold text-white text-lg">Setup Progress</h3>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-primary-400">{progress}% Complete</span>
                <span className="text-text-muted">{steps.length - currentStepIndex} steps left</span>
              </div>
              <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Steps Chain */}
          <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-0 lg:justify-around">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-3 group w-full sm:w-auto">
                {/* Line Connector (Desktop) */}
                {index > 0 && (
                  <div className={cn(
                    "hidden lg:block h-px w-12 mx-2 transition-colors",
                    steps[index - 1].status === "completed" ? "bg-primary/30" : "bg-white/10"
                  )} />
                )}
                
                <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-2 w-full">
                  <div className={cn(
                    "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center border transition-all",
                    step.status === "completed" ? "bg-success-500/10 border-success-500/20 text-success-500" :
                    step.status === "current" ? "bg-primary/10 border-primary/50 text-primary-400 shadow-[0_0_10px_rgba(0,185,173,0.2)]" :
                    "bg-white/5 border-white/10 text-text-muted"
                  )}>
                    {step.status === "completed" ? <CheckCircle2 className="h-5 w-5" /> :
                     step.status === "current" ? <Circle className="h-5 w-5 fill-current" /> :
                     <Circle className="h-5 w-5" />}
                  </div>
                  
                  <div className="flex-1 lg:w-max">
                    <p className={cn(
                      "text-sm font-bold transition-colors",
                      step.status === "current" ? "text-white" : "text-text-secondary"
                    )}>{step.label}</p>
                    <p className="text-xs text-text-muted hidden lg:block">{step.description}</p>
                  </div>

                  {step.status === "current" && (
                    <Button size="sm" className="ml-auto lg:hidden h-7 text-xs bg-primary/10 text-primary-400 hover:bg-primary/20 border border-primary/20">
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action */}
          <div className="hidden lg:block">
             <Button className="bg-primary hover:bg-primary-600 text-white shadow-lg shadow-primary/20 group">
               Continue Setup <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
             </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
