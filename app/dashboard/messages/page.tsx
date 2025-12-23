"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Search, MoreVertical, Phone, Video, Mic, Image, Send, Bot, Sparkles, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/Switch";

// Mock Data
const conversations = [
  {
    id: 1,
    user: "Alex Johnson",
    handle: "@alex_johnson",
    lastMessage: "Interested in coaching",
    time: "2m",
    unread: 2,
    active: true,
    status: 'online'
  },
  {
    id: 2,
    user: "Sarah Coach",
    handle: "@sarah_coach",
    lastMessage: "Ready to book call",
    time: "5m",
    unread: 1,
    active: false,
    status: 'online'
  },
  {
    id: 3,
    user: "Mark Business",
    handle: "@mark_business",
    lastMessage: "Following up...",
    time: "1h",
    unread: 0,
    active: false,
    status: 'offline'
  },
];

const messages = [
  { id: 1, text: "Hey Alex! Thanks for reaching out :) What resonated with you most about that post?", sender: "ai", time: "2:34 PM" },
  { id: 2, text: "Yeah interested in learning more about how you help coaches scale.", sender: "user", time: "2:35 PM" },
  { id: 3, text: "That makes sense! A lot of coaches struggle with the systems part. What's your biggest bottleneck right now?", sender: "ai", time: "2:36 PM" },
];

export default function MessagesPage() {
  const [aiActive, setAiActive] = useState(true);

  return (
    <div className="h-[calc(100vh-6rem)] flex gap-6 overflow-hidden animate-fade-in pb-2">
      {/* Conversations List Sidebar */}
      <div className="w-80 flex flex-col glass-panel rounded-2xl overflow-hidden flex-shrink-0 border border-white/[0.08]">
        <div className="p-4 border-b border-white/[0.06] space-y-4 bg-white/[0.02]">
          <div className="flex items-center justify-between">
             <h2 className="font-heading font-bold text-white text-lg tracking-tight">Messages</h2>
             <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-white transition-colors">
               <MoreVertical className="h-4 w-4" />
             </Button>
          </div>
          <div className="relative group">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted group-focus-within:text-primary-400 transition-colors" />
             <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-black/20 border border-white/[0.06] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all placeholder:text-text-muted/70"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
          {conversations.map((conv) => (
            <div 
              key={conv.id}
              className={cn(
                "p-3 rounded-xl cursor-pointer transition-all duration-200 border group",
                conv.active 
                  ? "bg-primary/10 border-primary/20 shadow-lg shadow-primary/5 relative overflow-hidden" 
                  : "border-transparent hover:bg-white/[0.04]"
              )}
            >
              {conv.active && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-l-xl" />
              )}
              <div className="flex items-center gap-3 relative z-10">
                <div className="relative flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 ring-2 ring-white/5 shadow-inner flex items-center justify-center text-xs font-bold text-white/20">
                    {conv.user.charAt(0)}
                  </div>
                  {conv.status === 'online' && (
                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-success-500 border-[3px] border-[#0B1426] shadow-sm" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={cn(
                      "font-semibold text-sm truncate",
                      conv.active ? "text-white" : "text-text-secondary group-hover:text-white transition-colors"
                    )}>{conv.user}</span>
                    <span className="text-[10px] text-text-muted font-medium">{conv.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={cn(
                      "text-xs truncate max-w-[140px]",
                      conv.active ? "text-primary-200" : "text-text-muted"
                    )}>{conv.lastMessage}</p>
                    {conv.unread > 0 && (
                      <span className="bg-primary-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center shadow-md shadow-primary/20 animate-pulse-glow">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col glass-panel rounded-2xl overflow-hidden relative border border-white/[0.08]">
        {/* Chat Header */}
        <div className="h-20 px-6 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.02] backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
               <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg shadow-primary/20 ring-2 ring-white/10" />
               <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-success-500 border-[3px] border-[#0B1426] rounded-full"></div>
            </div>
            <div>
              <h3 className="font-bold text-white text-base tracking-tight">Alex Johnson</h3>
              <div className="flex items-center gap-2">
                 <p className="text-xs text-primary-400 font-medium bg-primary/10 px-1.5 py-0.5 rounded">@alex_johnson</p>
                 <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Active now</span>
              </div>
            </div>
          </div>

          {/* AI Toggle */}
          <div className="flex items-center gap-3 bg-black/20 rounded-full p-1 pr-4 border border-white/10">
             <div className={cn(
               "flex items-center justify-center h-8 w-8 rounded-full transition-all",
               aiActive ? "bg-success-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.4)]" : "bg-white/10 text-text-muted"
             )}>
               <Bot className="h-4 w-4" />
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted leading-none mb-0.5">AI Status</span>
               <div className="flex items-center gap-2">
                 <span className={cn("text-xs font-bold", aiActive ? "text-white" : "text-text-muted")}>
                   {aiActive ? "Active" : "Paused"}
                 </span>
                 <Switch 
                   checked={aiActive} 
                   onChange={() => setAiActive(!aiActive)} 
                   className="scale-75 data-[state=checked]:bg-success-500"
                 />
               </div>
             </div>
          </div>

          <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-full border border-white/[0.05]">
            <Button variant="ghost" size="icon" className="text-text-secondary hover:text-white rounded-full hover:bg-white/5 h-9 w-9">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-text-secondary hover:text-white rounded-full hover:bg-white/5 h-9 w-9">
              <Video className="h-4 w-4" />
            </Button>
            <div className="w-px h-5 bg-white/[0.1] mx-1" />
            <Button variant="ghost" size="icon" className="text-text-secondary hover:text-white rounded-full hover:bg-white/5 h-9 w-9">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-black/20 pb-32">
          <div className="flex justify-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted bg-white/[0.05] px-4 py-1.5 rounded-full border border-white/[0.05]">Today, Dec 8</span>
          </div>
          
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "flex gap-4 max-w-[70%]",
                msg.sender === 'ai' ? "self-end flex-row-reverse ml-auto" : "self-start"
              )}
            >
               {msg.sender === 'user' && (
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex-shrink-0 ring-2 ring-white/5 mt-auto flex items-center justify-center text-xs font-bold text-white/20">
                     U
                  </div>
               )}
               {msg.sender === 'ai' && (
                  <div className="h-9 w-9 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0 ring-2 ring-primary/20 mt-auto shadow-lg shadow-primary/20">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
               )}
               
               <div className={cn(
                 "p-5 rounded-2xl text-sm leading-relaxed shadow-sm relative group transition-all duration-200",
                 msg.sender === 'ai' 
                   ? "bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-br-none shadow-primary/10" 
                   : "bg-[#1E293B] text-white border border-white/[0.06] rounded-bl-none hover:bg-[#233045]"
               )}>
                 <p className="leading-6">{msg.text}</p>
                 <div className={cn(
                   "flex items-center gap-1.5 text-[10px] mt-2 opacity-60 font-medium",
                   msg.sender === 'ai' ? "justify-end text-white" : "text-text-muted"
                 )}>
                    {msg.sender === 'ai' && <Sparkles className="h-2.5 w-2.5" />}
                    <span>{msg.time}</span>
                    {msg.sender === 'ai' && <CheckCheck className="h-3 w-3 ml-0.5" />}
                 </div>
               </div>
            </div>
          ))}

          {/* AI Handling Indicator */}
          {aiActive && (
            <div className="flex justify-center py-6">
              <div className="flex items-center gap-3 bg-gradient-to-r from-success-500/10 to-emerald-500/10 px-5 py-2.5 rounded-full border border-success-500/20 shadow-lg shadow-success-500/5 backdrop-blur-sm animate-pulse-glow">
                 <Sparkles className="h-3.5 w-3.5 text-success-500 animate-spin-slow" />
                 <span className="text-xs text-success-500 font-bold uppercase tracking-wide">AI is handling this</span>
                 <div className="h-4 w-px bg-success-500/20 mx-1" />
                 <button 
                   onClick={() => setAiActive(false)}
                   className="text-xs font-bold text-white hover:text-success-200 transition-colors"
                 >
                   Pause
                 </button>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-5 border-t border-white/[0.06] bg-white/[0.02] backdrop-blur-md absolute bottom-0 left-0 right-0 z-20">
          <div className="relative flex items-center gap-3 max-w-4xl mx-auto">
            <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="text-text-muted hover:text-white rounded-full hover:bg-white/5 transition-colors">
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-text-muted hover:text-white rounded-full hover:bg-white/5 transition-colors">
                <Mic className="h-5 w-5" />
                </Button>
            </div>
            
            <div className="flex-1 relative group">
               <input 
                type="text" 
                placeholder={aiActive ? "Type to interrupt AI and take over..." : "Type a message..."}
                className="w-full bg-black/40 border border-white/[0.1] rounded-full px-6 py-3.5 text-sm text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all shadow-inner placeholder:text-text-muted/50"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/5 px-2 py-0.5 rounded text-[10px] text-text-muted font-medium border border-white/5">CMD + Enter</div>
            </div>
            
            <Button size="icon" className="bg-primary hover:bg-primary-600 text-white rounded-full h-11 w-11 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex-shrink-0">
              <Send className="h-5 w-5 ml-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
