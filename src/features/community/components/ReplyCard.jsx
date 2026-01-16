import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, ShieldCheck } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import VoteButtons from '@/components/ui/VoteButtons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ReplyCard = ({ reply, isAccepted }) => {
  return (
    <div className={cn(
       "flex gap-4 md:gap-6 p-6 rounded-xl border transition-all",
       isAccepted 
       ? "bg-green-50/30 border-green-200 dark:bg-green-900/10 dark:border-green-800"
       : "bg-card border-border/50"
    )}>
      {/* Vote Column */}
      <div className="flex flex-col items-center pt-2">
         <VoteButtons upvotes={reply.upvotes} downvotes={reply.downvotes} />
         {isAccepted && (
            <div className="mt-4 flex flex-col items-center gap-1 text-green-600">
               <CheckCircle className="w-6 h-6 fill-green-100" />
               <span className="text-[10px] font-bold uppercase tracking-wider text-center">Accepted<br/>Answer</span>
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
                <button className="hover:text-foreground">Share</button>
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
                    <p className="text-xs text-muted-foreground">
                       {reply.author.role || 'Community Member'}
                    </p>
                 </div>
                 <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={reply.author.avatar} />
                    <AvatarFallback>{reply.author.name[0]}</AvatarFallback>
                 </Avatar>
             </div>
         </div>
      </div>
    </div>
  );
};

export default ReplyCard;
