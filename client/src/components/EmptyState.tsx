import { Droplets } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12" data-testid="empty-state">
      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Droplets className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-2xl font-heading font-semibold mb-2">
        Welcome to Neer Sahayak
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Ask me anything about water filters, purifiers, and maintenance. I'm here to help you make the best choice for clean, safe drinking water.
      </p>
    </div>
  );
}
