import React from 'react';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const VoteButtons = ({ 
  upvotes = 0, 
  downvotes = 0, 
  userVote = null, // 'up', 'down', or null
  onVote,
  orientation = 'vertical', // 'vertical' or 'horizontal'
  className
}) => {
  const score = upvotes - downvotes;

  const handleUpvote = () => {
    if (onVote) {
      onVote(userVote === 'up' ? null : 'up');
    }
  };

  const handleDownvote = () => {
    if (onVote) {
      onVote(userVote === 'down' ? null : 'down');
    }
  };

  if (orientation === 'horizontal') {
    return (
      <div className={cn("flex items-center gap-2 bg-muted/30 rounded-full border border-border/50 p-1", className)}>
        <button
          onClick={handleUpvote}
          className={cn(
            "p-1 rounded-full hover:bg-background transition-colors",
            userVote === 'up' ? "text-orange-500" : "text-muted-foreground hover:text-orange-500"
          )}
        >
          <ArrowBigUp className={cn("w-6 h-6", userVote === 'up' && "fill-current")} />
        </button>
        <span className={cn(
          "text-sm font-bold min-w-[2ch] text-center",
          userVote === 'up' ? "text-orange-500" : userVote === 'down' ? "text-blue-500" : "text-foreground"
        )}>
          {score}
        </span>
        <button
          onClick={handleDownvote}
          className={cn(
            "p-1 rounded-full hover:bg-background transition-colors",
            userVote === 'down' ? "text-blue-500" : "text-muted-foreground hover:text-blue-500"
          )}
        >
          <ArrowBigDown className={cn("w-6 h-6", userVote === 'down' && "fill-current")} />
        </button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <button
        onClick={handleUpvote}
        className={cn(
          "p-1 rounded hover:bg-orange-500/10 transition-colors",
          userVote === 'up' ? "text-orange-500" : "text-muted-foreground hover:text-orange-500"
        )}
        title="Upvote"
      >
        <ArrowBigUp className={cn("w-8 h-8", userVote === 'up' && "fill-current")} />
      </button>
      
      <span className={cn(
        "text-lg font-bold",
        userVote === 'up' ? "text-orange-500" : userVote === 'down' ? "text-blue-500" : "text-foreground"
      )}>
        {score}
      </span>
      
      <button
        onClick={handleDownvote}
        className={cn(
          "p-1 rounded hover:bg-blue-500/10 transition-colors",
          userVote === 'down' ? "text-blue-500" : "text-muted-foreground hover:text-blue-500"
        )}
        title="Downvote"
      >
        <ArrowBigDown className={cn("w-8 h-8", userVote === 'down' && "fill-current")} />
      </button>
    </div>
  );
};

export default VoteButtons;
