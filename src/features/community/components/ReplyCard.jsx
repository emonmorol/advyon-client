import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, ShieldCheck, ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const ReplyCard = ({ reply, isAccepted, onUpvote, onDownvote }) => {
   const [isVoting, setIsVoting] = useState(false);
   const [userVote, setUserVote] = useState(null); // 'up', 'down', or null

   const handleUpvote = async () => {
      if (!onUpvote || isVoting) return;

      // If already upvoted, do nothing
      if (userVote === 'up') return;

      setIsVoting(true);
      try {
         await onUpvote();
         setUserVote('up'); // Track user's vote locally
      } catch (error) {
         console.error('Failed to upvote:', error);
      } finally {
         setIsVoting(false);
      }
   };

   const handleDownvote = async () => {
      if (!onDownvote || isVoting) return;

      // If already downvoted, do nothing
      if (userVote === 'down') return;

      setIsVoting(true);
      try {
         await onDownvote();
         setUserVote('down'); // Track user's vote locally
      } catch (error) {
         console.error('Failed to downvote:', error);
      } finally {
         setIsVoting(false);
      }
   };

   // Vote score calculation
   const upvoteCount = reply.upvotes || 0;
   const downvoteCount = reply.downvotes || 0;
   const score = upvoteCount - downvoteCount;

   return (
      <div className={cn(
         "flex gap-4 md:gap-6 p-6 rounded-xl border transition-all",
         isAccepted
            ? "bg-green-50/30 border-green-200 dark:bg-green-900/10 dark:border-green-800"
            : "bg-card border-border/50"
      )}>
         {/* Vote Column */}
         <div className="flex flex-col items-center pt-2">
            {/* Upvote Button */}
            <button
               onClick={handleUpvote}
               disabled={isVoting || userVote === 'up'}
               className={cn(
                  "p-1 rounded hover:bg-orange-500/10 transition-colors",
                  userVote === 'up'
                     ? "text-orange-500 cursor-default"
                     : "text-muted-foreground hover:text-orange-500",
                  isVoting && "opacity-50 cursor-wait"
               )}
               title={userVote === 'up' ? "You upvoted this" : "Upvote"}
            >
               <ArrowBigUp className={cn("w-8 h-8", userVote === 'up' && "fill-current")} />
            </button>

            {/* Vote Score */}
            <span className={cn(
               "text-lg font-bold",
               score > 0 ? "text-orange-500" : score < 0 ? "text-blue-500" : "text-foreground"
            )}>
               {score}
            </span>

            {/* Downvote Button */}
            <button
               onClick={handleDownvote}
               disabled={isVoting || userVote === 'down'}
               className={cn(
                  "p-1 rounded hover:bg-blue-500/10 transition-colors",
                  userVote === 'down'
                     ? "text-blue-500 cursor-default"
                     : "text-muted-foreground hover:text-blue-500",
                  isVoting && "opacity-50 cursor-wait"
               )}
               title={userVote === 'down' ? "You downvoted this" : "Downvote"}
            >
               <ArrowBigDown className={cn("w-8 h-8", userVote === 'down' && "fill-current")} />
            </button>

            {isAccepted && (
               <div className="mt-4 flex flex-col items-center gap-1 text-green-600">
                  <CheckCircle className="w-6 h-6 fill-green-100" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-center">Accepted<br />Answer</span>
               </div>
            )}
         </div>

         <div className="flex-1 min-w-0 space-y-4">
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground">
               {reply.content}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
               <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                  <button className="hover:text-foreground">Reply</button>
                  <span className="text-muted-foreground/50">
                     Answered {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                  </span>
               </div>

               <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                     <p className="text-sm font-medium flex items-center justify-end gap-1">
                        {reply.author.name}
                        {reply.author.isLawyer && (
                           <ShieldCheck className="w-3.5 h-3.5 text-blue-600" aria-label="Verified Lawyer" />
                        )}
                     </p>
                     <p className="text-xs text-muted-foreground capitalize">
                        {reply.author.role || 'Community Member'}
                     </p>
                  </div>
                  <Avatar className="h-10 w-10 border border-border">
                     <AvatarImage src={reply.author.avatar} />
                     <AvatarFallback>{reply.author.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ReplyCard;
