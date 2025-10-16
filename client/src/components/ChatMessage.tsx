import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Droplets, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { type Message } from "@shared/schema";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = memo(({ message }: ChatMessageProps) => {
  const isBot = message.role === 'bot';
  const formattedTime = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(message.timestamp);

  return (
    <div
      className={`flex gap-3 mb-4 animate-fade-in-up ${
        isBot ? 'justify-start' : 'justify-end'
      }`}
      data-testid={`message-${message.role}-${message.id}`}
    >
      {isBot && (
        <Avatar className="h-8 w-8 flex-shrink-0" data-testid="avatar-bot">
          <AvatarFallback className="bg-primary/10 text-primary">
            <Droplets className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} max-w-[85%] sm:max-w-[75%]`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isBot
              ? 'bg-primary/10 text-foreground'
              : 'bg-primary text-primary-foreground'
          }`}
        >
          {isBot ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="mb-2 last:mb-0 ml-4 list-disc space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="mb-2 last:mb-0 ml-4 list-decimal space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-primary hover:text-primary/80 underline underline-offset-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
          )}
        </div>
        <span className="text-xs text-muted-foreground mt-1 px-1" data-testid={`timestamp-${message.id}`}>
          {formattedTime}
        </span>
      </div>

      {!isBot && (
        <Avatar className="h-8 w-8 flex-shrink-0" data-testid="avatar-user">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';
