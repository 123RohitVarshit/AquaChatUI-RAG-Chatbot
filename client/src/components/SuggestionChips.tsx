import { Button } from "@/components/ui/button";

interface SuggestionChipsProps {
  onSelectSuggestion: (suggestion: string) => void;
  disabled?: boolean;
}

const suggestions = [
  "What's the best RO purifier for high TDS water?",
  "How often should I replace my water filter?",
  "Compare AquaPure vs ClearFlow purifiers"
];

export function SuggestionChips({ onSelectSuggestion, disabled = false }: SuggestionChipsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 flex-wrap justify-center px-4">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          onClick={() => onSelectSuggestion(suggestion)}
          disabled={disabled}
          className="rounded-full text-sm"
          data-testid={`suggestion-chip-${index}`}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}
