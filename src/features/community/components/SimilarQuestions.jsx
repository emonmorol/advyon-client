import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SimilarQuestions = ({ currentTitle }) => {
  // Mock data - in real app would fetch based on currentTitle
  const questions = [
     "Process for mutual consent divorce in India?",
     "Rights of a tenant without rental agreement",
     "How to file a consumer complaint online?",
     "Is cyberstalking a bailable offence?"
  ];

  if (!currentTitle || currentTitle.length < 5) return null;

  return (
    <Card className="border-border/60 bg-muted/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
           <FileText className="w-4 h-4 text-primary" />
           Similar Questions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
           {questions.map((q, i) => (
              <li key={i}>
                 <a href="#" className="text-sm text-foreground hover:text-primary hover:underline flex items-start gap-2 group">
                    <ArrowRight className="w-3.5 h-3.5 mt-0.5 opacity-50 group-hover:translate-x-0.5 transition-transform" />
                    {q}
                 </a>
              </li>
           ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default SimilarQuestions;
