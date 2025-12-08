"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RotateCcw, Save, ThumbsUp, ThumbsDown, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const initialMessages = [
  { id: 1, text: "Hey! Saw your post about scaling. What's your biggest challenge right now?", sender: "ai", time: "Now" },
];

export function TestChat() {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const newMsg = { id: Date.now(), text: inputValue, sender: "user", time: "Now" };
    setMessages([...messages, newMsg]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "That makes total sense. A lot of people I talk to feel the same way. Have you tried automating any part of that process yet?", 
        sender: "ai", 
        time: "Now" 
      }]);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-16rem)]">
      {/* Chat Interface */}
      <Card className="lg:col-span-2 flex flex-col bg-background-secondary/30 backdrop-blur-sm border-border/50 overflow-hidden">
        <div className="p-4 border-b border-border/50 flex justify-between items-center bg-background-secondary/50">
          <div>
             <h3 className="font-bold text-white">Test Simulator</h3>
             <p className="text-xs text-text-muted">You are chatting with your AI configuration</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setMessages(initialMessages)} className="text-text-secondary border-border hover:bg-white/5">
            <RotateCcw className="h-3 w-3 mr-2" />
            Reset
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
           {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "flex gap-3 max-w-[80%]",
                msg.sender === 'ai' ? "self-start" : "self-end flex-row-reverse ml-auto"
              )}
            >
               {msg.sender === 'ai' && (
                  <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0 border-2 border-primary-500/50">
                    <span className="text-[10px] font-bold text-white">AI</span>
                  </div>
               )}
               <div className={cn(
                 "p-3 rounded-2xl text-sm",
                 msg.sender === 'ai' 
                   ? "bg-background-secondary text-white border border-border rounded-tl-none"
                   : "bg-primary-600 text-white rounded-tr-none" 
               )}>
                 <p>{msg.text}</p>
               </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border/50 bg-background-secondary/50">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            <input 
              type="text" 
              placeholder="Type as if you were a lead..." 
              className="flex-1 bg-background border border-border rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button type="submit" size="icon" className="bg-primary-600 hover:bg-primary-700 text-white rounded-full h-9 w-9">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>

      {/* Feedback Panel */}
      <div className="space-y-4">
        <Card className="bg-background-secondary/30 backdrop-blur-sm">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-white">Feedback</h3>
            <p className="text-sm text-text-secondary">How was this specific interaction?</p>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 border-border hover:bg-success-500/10 hover:text-success-500 hover:border-success-500/50">
                <ThumbsUp className="h-4 w-4 mr-2" />
                Good
              </Button>
              <Button variant="outline" className="flex-1 border-border hover:bg-error-500/10 hover:text-error-500 hover:border-error-500/50">
                <ThumbsDown className="h-4 w-4 mr-2" />
                Bad
              </Button>
            </div>

            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-text-muted mb-2">Notes on tone/response:</p>
              <textarea className="w-full bg-background/50 border border-border rounded-lg p-2 text-sm text-white h-24 resize-none focus:outline-none focus:border-primary-500" placeholder="e.g. Too pushy, or too casual..." />
            </div>

             <Button className="w-full bg-background-secondary hover:bg-white/10 text-white border border-border">
              <Save className="h-4 w-4 mr-2" />
              Save as Example
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
