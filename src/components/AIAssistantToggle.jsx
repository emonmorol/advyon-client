import React from 'react';
import { Sparkles, Bot } from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

/**
 * AIAssistantToggle - A floating button to toggle the AI Assistant panel
 * Can be placed in navbar or as a floating action button
 * 
 * @param {function} onClick - Callback when button is clicked
 * @param {boolean} isActive - Whether AI panel is currently open
 * @param {string} position - 'navbar' | 'floating' - determines styling
 */
const AIAssistantToggle = ({
  onClick,
  isActive = false,
  position = 'navbar'
}) => {

  if (position === 'floating') {
    return (
      <button
        onClick={onClick}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg transition-all duration-300 z-30",
          "flex items-center justify-center group",
          isActive
            ? "bg-teal-500 shadow-teal-500/50 scale-95"
            : "bg-gradient-to-tr from-teal-400 to-emerald-600 hover:scale-110 hover:shadow-2xl hover:shadow-teal-500/50"
        )}
        title="Toggle AI Assistant"
      >
        <div className="relative">
          <Sparkles
            size={24}
            className={cn(
              "transition-all duration-300",
              isActive ? "text-primary-foreground rotate-180" : "text-primary-foreground group-hover:rotate-12"
            )}
          />
          {!isActive && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-background animate-pulse" />
          )}
        </div>
      </button>
    );
  }

  // Navbar style button
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 px-6 py-2 rounded-lg transition-all duration-300 min-w-[140px] group ",
        isActive
          ? "bg-accent text-primary border border-accent"
          : "bg-primary text-primary-foreground hover:bg-accent hover:text-primary border border-accent/30 shadow-[0_0_12px_rgba(var(--accent),0.2)]"
      )}
      title="Toggle AI Assistant"
    >
      <div className="relative">
        <Bot
          size={18}
          className={cn(
            "transition-transform duration-300",
            isActive && "rotate-12"
          )}
        />
        <span className={cn(
          "absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse transition-colors duration-90",
          isActive
            ? "bg-primary"
            : "bg-accent group-hover:bg-primary"
        )} />
      </div>
      <span className="text-sm font-medium hidden sm:inline">AI AGENT</span>
    </button>
  );
};

export default AIAssistantToggle;
