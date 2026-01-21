import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

/**
 * KeyPointsList - Component to display extracted key points from documents
 * @param {Array} points - Array of key point objects { text, importance, category }
 */
const KeyPointsList = ({ points = [] }) => {
  const getImportanceStyles = (importance) => {
    switch (importance) {
      case 'high':
        return {
          bg: 'bg-destructive/10',
          border: 'border-destructive/30',
          icon: AlertCircle,
          iconColor: 'text-destructive',
          badge: 'bg-destructive/20 text-destructive'
        };
      case 'medium':
        return {
          bg: 'bg-amber/10',
          border: 'border-amber/30',
          icon: Info,
          iconColor: 'text-amber',
          badge: 'bg-amber/20 text-amber'
        };
      default:
        return {
          bg: 'bg-teal-accent/10',
          border: 'border-teal-accent/30',
          icon: CheckCircle2,
          iconColor: 'text-teal-bright',
          badge: 'bg-teal-accent/20 text-teal-bright'
        };
    }
  };

  if (points.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Info className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground font-medium">No key points extracted</p>
        <p className="text-muted-foreground text-sm mt-1">
          AI analysis will extract key points from the document
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {points.map((point, index) => {
        const styles = getImportanceStyles(point.importance);
        const IconComponent = styles.icon;
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-3 rounded-lg border bg-card hover:bg-muted/50 transition-all group`}
          >
            <div className="flex items-start gap-3">
              {/* Importance Indicator */}
              <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${styles.badge.split(' ')[0].replace('bg-', 'bg-')}`} />
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded ${styles.badge}`}>
                    {point.importance || 'Normal'}
                  </span>
                  {point.category && (
                    <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                      • {point.category}
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {point.text}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default KeyPointsList;
