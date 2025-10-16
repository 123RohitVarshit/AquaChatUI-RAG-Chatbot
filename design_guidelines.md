# Design Guidelines for Neer Sahayak Water Filter Chatbot

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern conversational AI interfaces (ChatGPT, Claude) with a water-purification industry aesthetic. This chat application prioritizes clarity, readability, and smooth interactions over decorative elements.

## Core Design Principles
- **Clean Water Aesthetic**: Visual design evokes purity, cleanliness, and freshness through color and transparency effects
- **Conversational Flow**: Natural, easy-to-read message display with clear visual hierarchy between user and bot messages
- **Responsive Fluidity**: Seamless adaptation across all devices with mobile-first approach

## Color Palette

### Primary Colors (Dark Mode)
- **Water Blue Primary**: 190 91% 42% (cyan-600 equivalent) - Primary actions, bot elements
- **Aqua Teal Accent**: 172 66% 50% (teal-500 equivalent) - User messages, interactive elements
- **Background Base**: 222 47% 11% (slate-900) - Main background
- **Surface**: 217 33% 17% (slate-800) - Card backgrounds with glass-morphism

### Message Colors
- **Bot Messages**: 190 95% 39% with 10% opacity background (cyan-50 dark equivalent)
- **User Messages**: 172 66% 50% background with white text
- **Text Primary**: 210 40% 98% (slate-50) - Main text
- **Text Secondary**: 215 20% 65% (slate-400) - Timestamps, metadata

### Accent & Interactive
- **Focus Rings**: Cyan/teal gradient at 50% opacity
- **Error States**: Red-500 for errors with retry buttons
- **Success Indicators**: Green-400 for successful operations

## Typography
- **Primary Font**: Inter - All UI elements, body text, messages
- **Heading Font**: Poppins - Branding, header titles
- **Sizes**: Base 16px, Messages 15px, Timestamps 13px, Headers 24px
- **Weights**: Regular (400) for body, Medium (500) for emphasis, SemiBold (600) for headings, Bold (700) for branding

## Layout System
**Spacing Units**: Tailwind spacing scale focused on 2, 4, 6, 8, 12, 16, 20, 24 units
- Message padding: p-4 (16px)
- Section spacing: py-6 to py-12
- Container max-width: max-w-4xl for optimal reading
- Chat area: Full viewport height minus header and input (h-[calc(100vh-200px)])

## Component Library

### Header Component
- Full-width glass-morphism bar with backdrop-blur-lg
- "Neer Sahayak" branding with gradient text effect (cyan-400 to teal-400)
- Water droplet icon (Lucide: Droplet or Droplets)
- Subtitle: "Your Water Filter Expert Assistant" in slate-400
- Sticky positioning at top

### Chat Message Components
- **Bot Messages**: Left-aligned with water droplet avatar, cyan-50/10 background, rounded-2xl corners
- **User Messages**: Right-aligned with user icon avatar, teal-500 background, white text, rounded-2xl
- **Timestamps**: Small text below each message in slate-400
- **Markdown Support**: Bold text for products/prices, bullet points with proper indentation, blue underlined links

### Chat Input Component
- Large textarea with min-height of 60px, max-height of 200px
- Placeholder: "Ask about water filters..." in slate-500
- Send button: Paper plane icon (Lucide: Send) in cyan-500, disabled state in slate-600
- Character limit indicator (optional, 1000 chars) in bottom-right
- Focus state: Cyan ring with glow effect

### Loading & Status Components
- **Typing Indicator**: Three animated dots pulsing sequentially in cyan-400
- **Message Skeleton**: Shimmer effect placeholder with gradient animation before streaming
- **Error State**: Red-tinted message with retry button
- **Empty State**: Center-aligned welcome message with three suggestion chips

### Suggestion Chips
Display as rounded-full buttons below welcome message:
1. "What's the best RO purifier for high TDS water?"
2. "How often should I replace my water filter?"
3. "Compare AquaPure vs ClearFlow purifiers"
Style: bg-slate-800 hover:bg-cyan-900/30 text-cyan-400 px-6 py-3

## Visual Effects

### Glass-Morphism
- Chat container: backdrop-blur-xl with bg-slate-900/40 and border border-slate-700/50
- Subtle shadow: shadow-2xl with cyan-500/10 glow
- Rounded corners: rounded-3xl for main container

### Animations
- **Message Entrance**: Fade-in with slide-up (20px) over 300ms
- **Streaming Text**: Character-by-character reveal at 50ms intervals
- **Typing Indicator**: Staggered pulse animation on three dots (100ms delay between each)
- **Scroll Behavior**: Smooth auto-scroll to bottom as messages appear
- **Button Hover**: Scale 1.02 transform with 200ms transition

### Background
- Full viewport gradient from cyan-950 via slate-900 to teal-950
- Subtle noise texture overlay at 5% opacity for depth

## Interaction Patterns
- **Send Message**: Enter key or Send button click
- **Clear Input**: Esc key to clear textarea
- **Auto-Scroll**: Always scroll to latest message after streaming
- **Retry Failed**: Click retry button on error messages
- **Suggestion Click**: Populate input and auto-send

## Streaming Response Strategy
1. Display loading skeleton immediately on send
2. Stream response word-by-word (50ms per word)
3. Parse markdown in real-time during streaming
4. Auto-scroll smoothly as content appears
5. Fade-in animation for completed message

## Responsive Breakpoints
- **Mobile (< 640px)**: Single column, reduced padding (p-3), smaller text (14px)
- **Tablet (640px - 1024px)**: Moderate spacing, full features
- **Desktop (> 1024px)**: Max-width container (4xl), optimal spacing

## Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation: Tab through inputs, Enter to send
- Focus indicators with high-contrast cyan rings
- Screen reader announcements for new messages
- Alt text for avatar icons

## Images
No large hero images required - this is a full-screen chat application. Only small icons needed:
- Water droplet icon for bot avatar (Lucide: Droplets)
- User circle icon for user avatar (Lucide: User)
- Send icon for submit button (Lucide: Send)
- Refresh icon for retry button (Lucide: RotateCcw)