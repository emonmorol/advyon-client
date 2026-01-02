import React from 'react';
import { MessageSquare, ThumbsUp, Eye, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const ThreadCard = ({ thread, onClick }) => {
    return (
        <Card
            className="group hover:border-primary/50 transition-all duration-300 cursor-pointer border-border/60 bg-card/50 hover:bg-card hover:shadow-md"
            onClick={onClick}
        >
            <CardContent className="p-6 sm:p-8">
                <div className="flex gap-6">
                    {/* Vote Counter - Desktop */}
                    <div className="hidden sm:flex flex-col items-center gap-1 min-w-[4rem] pt-1">
                        <div className="flex flex-col items-center p-3 rounded-xl bg-background/50 border border-border/50 group-hover:border-primary/20 transition-colors w-full">
                            <ThumbsUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="text-base font-bold text-foreground mt-1.5">{thread.votes}</span>
                        </div>
                    </div>

                    <div className="flex-1 min-w-0 space-y-4">
                        {/* Header: Author & Meta */}
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Avatar className="w-8 h-8 border border-border">
                                    <AvatarImage src={thread.author.avatar} />
                                    <AvatarFallback>{thread.author.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-foreground hover:underline">{thread.author.name}</span>
                                <span>•</span>
                                <span>{thread.author.role}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    {thread.postedAt}
                                </span>
                            </div>
                            {thread.isSolved && (
                                <Badge variant="outline" className="border-green-500/30 bg-green-500/10 text-green-600 text-xs px-2.5 py-1 gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Solved
                                </Badge>
                            )}
                        </div>

                        {/* Content */}
                        <div className="space-y-2.5">
                            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                {thread.title}
                            </h3>
                            <p className="text-base text-muted-foreground line-clamp-2 leading-relaxed">
                                {thread.preview}
                            </p>
                        </div>

                        {/* Footer: Tags & Mobile Stats */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                            <div className="flex flex-wrap gap-2.5">
                                <Badge variant="secondary" className="bg-accent/10 text-accent hover:bg-accent/20 border-transparent font-normal px-3 py-1 text-sm">
                                    {thread.category}
                                </Badge>
                                {thread.tags.map(tag => (
                                    <Badge key={tag} variant="outline" className="text-muted-foreground border-border/50 font-normal px-3 py-1 text-sm">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>

                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                <div className="flex sm:hidden items-center gap-1.5">
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>{thread.votes}</span>
                                </div>
                                <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                                    <MessageSquare className="w-4 h-4" />
                                    <span>{thread.replies} replies</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Eye className="w-4 h-4" />
                                    <span>{thread.views}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ThreadCard;
