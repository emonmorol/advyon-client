import React from 'react';
import { motion } from 'framer-motion';
import ThreadCard from './ThreadCard';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const ThreadFeed = ({ threads, isLoading }) => {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-40 rounded-xl bg-muted/20 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
        >
            {threads.map((thread) => (
                <motion.div key={thread.id} variants={item}>
                    <ThreadCard
                        thread={thread}
                        onClick={() => console.log('Navigate to thread', thread.id)}
                    />
                </motion.div>
            ))}
        </motion.div>
    );
};

export default ThreadFeed;
