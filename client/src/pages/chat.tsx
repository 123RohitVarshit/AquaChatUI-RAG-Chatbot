import { useChat } from "@/lib/useChat";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { TypingIndicator } from "@/components/TypingIndicator";
import { MessageSkeleton } from "@/components/MessageSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { SuggestionChips } from "@/components/SuggestionChips";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export default function ChatPage() {
  const { messages, isLoading, error, sendMessage, retryLastMessage, messagesEndRef } = useChat();

  const hasMessages = messages.length > 0;
  const showTypingIndicator = isLoading && messages.length > 0 && !messages[messages.length - 1]?.isStreaming;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background to-background">
      <ChatHeader />
      
      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {!hasMessages ? (
            <>
              <EmptyState />
              <SuggestionChips onSelectSuggestion={sendMessage} disabled={isLoading} />
            </>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              
              {showTypingIndicator && <TypingIndicator />}
              
              {error && (
                <div className="flex items-center gap-3 mb-4 animate-fade-in-up" data-testid="error-message">
                  <div className="flex-1 rounded-2xl px-4 py-3 bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive mb-2">{error}</p>
                    <Button
                      onClick={retryLastMessage}
                      variant="outline"
                      size="sm"
                      data-testid="button-retry"
                    >
                      <RotateCcw className="h-3 w-3 mr-2" />
                      Retry
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <ChatInput
        onSendMessage={sendMessage}
        disabled={isLoading}
        placeholder="Ask about water filters..."
      />
    </div>
  );
}
