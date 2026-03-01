import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Eye, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useCommunityStore } from '@/store/useCommunityStore';
import { cn } from '@/lib/utils';

// Helper to format relative time
const formatTime = (date) => {
    if (!date) return 'recently';
    try {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
        return 'recently';
    }
};

const ThreadCard = ({ thread }) => {
    const { voteThread } = useCommunityStore();
    const [isVoting, setIsVoting] = useState(false);

    // Normalize data to handle both mock data and API response formats
    const id = thread._id || thread.id;
    const upvotesArray = thread.upvotes || [];
    const votes = thread.votes ?? upvotesArray.length ?? 0;
    const authorName = thread.author?.fullName || thread.author?.name || 'Anonymous';
    const authorAvatar = thread.author?.avatarUrl || thread.author?.avatar || '';
    const authorRole = thread.author?.role || 'Member';
    const authorVerificationStatus = thread.author?.verificationStatus || thread.author?.isVerified || null;
    const postedAt = thread.postedAt || formatTime(thread.createdAt);
    const preview = thread.preview || (thread.content?.substring(0, 200) + (thread.content?.length > 200 ? '...' : ''));
    const repliesCount = thread.replies ?? thread.repliesCount ?? 0;
    const tags = thread.tags || [];

    const handleVote = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isVoting) return;
        setIsVoting(true);

        try {
            await voteThread(id);
        } catch (error) {
            console.error('Failed to vote:', error);
        } finally {
            setIsVoting(false);
        }
    };

    return (
        <Card className="group hover:border-primary/50 transition-all duration-300 border-border/60 bg-card/50 hover:bg-card hover:shadow-md relative">
            <CardContent className="p-6 sm:p-8">
                {/* Like Button - Top Right Corner */}
                <button
                    onClick={handleVote}
                    disabled={isVoting}
                    className={cn(
                        "absolute top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-lg",
                        "bg-background/80 border border-border/50 transition-all",
                        "hover:border-primary/40 hover:bg-primary/10 active:scale-95",
                        votes > 0 && "border-primary/30 bg-primary/5",
                        isVoting && "opacity-50 cursor-wait"
                    )}
                >
                    <ThumbsUp className={cn(
                        "w-4 h-4 transition-colors",
                        votes > 0 ? "text-primary fill-primary/20" : "text-muted-foreground"
                    )} />
                    <span className={cn(
                        "text-sm font-semibold",
                        votes > 0 ? "text-primary" : "text-muted-foreground"
                    )}>{votes}</span>
                </button>

                <div className="space-y-4 pr-20">
                    {/* Header: Author & Meta */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Avatar className="w-8 h-8 border border-border">
                                <AvatarImage src={authorAvatar} />
                                <AvatarFallback>{authorName[0]?.toUpperCase() || 'U'}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground flex items-center gap-1">
                                {authorName}
                                {authorRole === 'lawyer' && authorVerificationStatus === 'verified' && (
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                )}
                            </span>
                            <span>•</span>
                            <span className="capitalize">{authorRole}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {postedAt}
                            </span>
                        </div>
                        {thread.isSolved && (
                            <Badge variant="outline" className="border-green-500/30 bg-green-500/10 text-green-600 text-xs px-2.5 py-1 gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Solved
                            </Badge>
                        )}
                    </div>

                    {/* Content - Clickable Link */}
                    <Link to={`/dashboard/community/thread/${id}`} className="block space-y-2.5 hover:opacity-80 transition-opacity">
                        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {thread.title}
                        </h3>
                        <p className="text-base text-muted-foreground line-clamp-2 leading-relaxed">
                            {preview}
                        </p>
                    </Link>

                    {/* Footer: Tags & Stats */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                        <div className="flex flex-wrap gap-2.5">
                            <Badge variant="secondary" className="bg-accent/10 text-accent hover:bg-accent/20 border-transparent font-normal px-3 py-1 text-sm">
                                {thread.category}
                            </Badge>
                            {tags.slice(0, 3).map(tag => (
                                <Badge key={tag} variant="outline" className="text-muted-foreground border-border/50 font-normal px-3 py-1 text-sm">
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            {/* Replies Link */}
                            <Link
                                to={`/dashboard/community/thread/${id}`}
                                className="flex items-center gap-1.5 hover:text-primary transition-colors"
                            >
                                <MessageSquare className="w-4 h-4" />
                                <span>{repliesCount} replies</span>
                            </Link>

                            <div className="flex items-center gap-1.5">
                                <Eye className="w-4 h-4" />
                                <span>{thread.views || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ThreadCard;
