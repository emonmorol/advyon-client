import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquarePlus } from 'lucide-react';
import QuestionForm from '@/features/community/components/QuestionForm';
import SimilarQuestions from '@/features/community/components/SimilarQuestions';
import { Toaster, toast } from 'sonner';

const AskQuestionPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Track title for "Similar Questions" component
  const [typingTitle, setTypingTitle] = useState(""); 

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    // Simulate API call
    console.log("Submitting question:", data);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Question posted successfully!", {
         description: "Redirecting you to the discussion...",
      });
      setTimeout(() => navigate('/dashboard/community'), 1500);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
               <MessageSquarePlus className="w-8 h-8" />
            </div>
            <div>
               <h1 className="text-2xl font-bold tracking-tight">Ask a Legal Question</h1>
               <p className="text-muted-foreground">Get advice from verified lawyers and community members.</p>
            </div>
          </div>

          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-card rounded-xl border border-border/60 shadow-sm p-6 sm:p-8"
          >
             <QuestionForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
           <div className="bg-card rounded-xl border border-border/60 p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Posting Guidelines</h3>
              <ul className="space-y-3 text-sm text-muted-foreground list-disc pl-4">
                 <li>Be specific about your legal issue.</li>
                 <li>Include relevant details like dates and locations.</li>
                 <li>Do not share sensitive personal information (names, phone numbers).</li>
                 <li>Keep the tone respectful and professional.</li>
                 <li>Search for similar questions before posting.</li>
              </ul>
           </div>

           <SimilarQuestions currentTitle="Sample Title" /> 
           {/* In a real app we'd pass the live title from the form state up to parent */}
        </div>

      </div>
      <Toaster />
    </div>
  );
};

export default AskQuestionPage;
