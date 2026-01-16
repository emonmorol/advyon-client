import React from 'react';
import { Trophy, TrendingUp, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const TrendingSidebar = ({ contributors, tags }) => {
    return (
        <div className="space-y-6">
            {/* Top Contributors */}
            <Card className="border-border/60 bg-card/50">
                <CardHeader className="pb-4 pt-6 px-6">
                    <CardTitle className="text-lg flex items-center gap-2.5">
                        <Trophy className="w-5 h-5 text-amber-500" />
                        Top Contributors
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 px-6 pb-6">
                    {contributors.map((user, index) => (
                        <div key={user.id} className="flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Avatar className="w-10 h-10 border border-border">
                                        <AvatarImage src={user.avatar || user.avatarUrl} />
                                        <AvatarFallback>{(user.name || user.fullName || '?')[0]}</AvatarFallback>
                                    </Avatar>
                                    {index < 3 && (
                                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[10px] text-white font-bold border-2 border-background">
                                            {index + 1}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
                                        {user.name || user.fullName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{user.role}</p>
                                </div>
                            </div>
                            <span className="text-sm font-mono font-medium text-accent">
                                {(user.points || 0).toLocaleString()}
                            </span>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card className="border-border/60 bg-card/50">
                <CardHeader className="pb-4 pt-6 px-6">
                    <CardTitle className="text-lg flex items-center gap-2.5">
                        <TrendingUp className="w-5 h-5 text-teal-500" />
                        Trending Topics
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                    <div className="flex flex-wrap gap-2.5">
                        {tags.map((tag) => (
                            <Badge
                                key={tag.name}
                                variant="secondary"
                                className="bg-background hover:bg-accent/10 hover:text-accent border border-border/50 transition-colors cursor-pointer px-3 py-1.5 text-sm"
                            >
                                <Hash className="w-3.5 h-3.5 mr-1.5 opacity-50" />
                                {tag.name}
                                <span className="ml-2 text-xs text-muted-foreground">
                                    {tag.count}
                                </span>
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TrendingSidebar;
