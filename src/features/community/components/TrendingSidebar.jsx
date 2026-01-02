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
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        Top Contributors
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {contributors.map((user, index) => (
                        <div key={user.id} className="flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Avatar className="w-8 h-8 border border-border">
                                        <AvatarImage src={user.avatar} />
                                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    {index < 3 && (
                                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 flex items-center justify-center text-[8px] text-white font-bold border border-background">
                                            {index + 1}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{user.role}</p>
                                </div>
                            </div>
                            <span className="text-xs font-mono font-medium text-accent">
                                {user.points.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card className="border-border/60 bg-card/50">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-teal-500" />
                        Trending Topics
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <Badge
                                key={tag.name}
                                variant="secondary"
                                className="bg-background hover:bg-accent/10 hover:text-accent border border-border/50 transition-colors cursor-pointer"
                            >
                                <Hash className="w-3 h-3 mr-1 opacity-50" />
                                {tag.name}
                                <span className="ml-1.5 text-[10px] text-muted-foreground">
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
