import React from 'react';
import { Sparkles } from 'lucide-react';

const AISummary = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20 border border-violet-100 dark:border-violet-900 rounded-xl p-5 mb-8">
       <div className="flex items-center gap-2 mb-3 text-violet-700 dark:text-violet-300 font-semibold text-sm uppercase tracking-wide">
          <Sparkles className="w-4 h-4" />
          AI Summary
       </div>
       <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
          {summary}
       </p>
       <p className="text-xs text-muted-foreground mt-3 italic">
          This summary is AI-generated based on the discussion thread.
       </p>
    </div>
  );
};

export default AISummary;
