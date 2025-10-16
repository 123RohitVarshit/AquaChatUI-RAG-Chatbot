import { Droplets } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function MessageSkeleton() {
  return (
    <div className="flex gap-3 mb-4 justify-start animate-fade-in-up" data-testid="message-skeleton">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className="bg-primary/10 text-primary">
          <Droplets className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      
      <div className="rounded-2xl px-4 py-3 bg-primary/10 max-w-[75%]">
        <div className="space-y-2">
          <div className="h-4 bg-primary/20 rounded animate-shimmer w-64" 
               style={{ 
                 backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                 backgroundSize: '1000px 100%'
               }} 
          />
          <div className="h-4 bg-primary/20 rounded animate-shimmer w-48"
               style={{ 
                 backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                 backgroundSize: '1000px 100%',
                 animationDelay: '0.1s'
               }}
          />
          <div className="h-4 bg-primary/20 rounded animate-shimmer w-56"
               style={{ 
                 backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                 backgroundSize: '1000px 100%',
                 animationDelay: '0.2s'
               }}
          />
        </div>
      </div>
    </div>
  );
}
