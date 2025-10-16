import { Droplets } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-4 justify-start" data-testid="typing-indicator">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className="bg-primary/10 text-primary">
          <Droplets className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      
      <div className="rounded-2xl px-4 py-3 bg-primary/10">
        <div className="flex gap-1.5 items-center">
          <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse-dot" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse-dot" style={{ animationDelay: '200ms' }} />
          <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse-dot" style={{ animationDelay: '400ms' }} />
        </div>
      </div>
    </div>
  );
}
