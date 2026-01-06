import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Share2, Flag, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import VoteButtons from '@/components/ui/VoteButtons';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const QuestionBody = ({ question }) => {
  return (
    <div className="flex gap-4 md:gap-6">
      {/* Vote Column */}
      <div className="hidden sm:flex flex-col items-center pt-2">
         <VoteButtons upvotes={question.upvotes} downvotes={question.downvotes} />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-4">
           <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-2">
                 {question.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                 <span className="flex items-center gap-1">
                    Asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                 </span>
                 <span className="w-1 h-1 rounded-full bg-border" />
                 <span className="text-foreground font-medium">{question.views} views</span>
                 <span className="w-1 h-1 rounded-full bg-border" />
                 <Badge variant="secondary" className="font-normal">{question.category}</Badge>
              </div>
           </div>
           
           <div className="flex-shrink-0">
               {question.isSolved && (
                  <div className="px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-full text-xs font-semibold uppercase tracking-wide">
                     Solved
                  </div>
               )}
           </div>
        </div>

        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-foreground leading-relaxed mb-6">
           {question.content}
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
           {question.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-muted/40 text-muted-foreground rounded text-xs">
                 #{tag}
              </span>
           ))}
        </div>

        {/* Footer Actions & Author */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border/40">
           <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                 <Share2 className="w-4 h-4 mr-2" />
                 Share
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
                 <Flag className="w-4 h-4 mr-2" />
                 Report
              </Button>
              <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                       <MoreHorizontal className="w-4 h-4" />
                    </Button>
                 </DropdownMenuTrigger>
                 <DropdownMenuContent>
                    <DropdownMenuItem>Follow Thread</DropdownMenuItem>
                    <DropdownMenuItem>Embed</DropdownMenuItem>
                 </DropdownMenuContent>
              </DropdownMenu>
           </div>

           <div className="flex items-center gap-3 px-4 py-2 bg-muted/20 rounded-lg">
              <span className="text-xs text-muted-foreground">Asked by</span>
              <div className="flex items-center gap-2">
                 <Avatar className="h-8 w-8">
                    <AvatarImage src={question.author.avatar} />
                    <AvatarFallback>{question.author.name[0]}</AvatarFallback>
                 </Avatar>
                 <div className="text-sm">
                    <p className="font-medium text-foreground">{question.author.name}</p>
                    <p className="text-xs text-muted-foreground">Member since 2023</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionBody;
