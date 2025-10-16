import { Droplets } from "lucide-react";

export function ChatHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-xl shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Droplets className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              Neer Sahayak
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Your Water Filter Expert Assistant
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
