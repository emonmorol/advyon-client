
import React from 'react';
import { motion } from 'framer-motion';
import { Construction, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ComingSoonPage = ({ title = "Coming Soon", description = "We are working hard to bring this feature to life." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-accent/10 p-6 rounded-full mb-6"
      >
        <Construction className="w-16 h-16 text-accent" />
      </motion.div>
      
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4"
      >
        {title}
      </motion.h1>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground text-lg max-w-md mb-8"
      >
        {description}
      </motion.p>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Button asChild variant="outline">
          <Link to="/dashboard" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default ComingSoonPage;
