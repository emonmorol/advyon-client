import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CommunityHeader = ({ stats, onAskQuestion }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-border/40">
            <div className="space-y-2">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-1"
                >
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Community Hub</h1>
                    <p className="text-muted-foreground max-w-2xl">
                        Connect with legal professionals, share insights, and find answers to complex legal questions.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-6 pt-2 text-sm text-muted-foreground"
                >
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <span className="font-medium text-foreground">{(stats?.discussions || 0).toLocaleString()}</span>
                        <span>Discussions</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-accent" />
                        <span className="font-medium text-foreground">{(stats?.online || 0).toLocaleString()}</span>
                        <span>Online now</span>
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
            >
                <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                    onClick={onAskQuestion}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Ask a Question
                </Button>
            </motion.div>
        </div>
    );
};

export default CommunityHeader;
