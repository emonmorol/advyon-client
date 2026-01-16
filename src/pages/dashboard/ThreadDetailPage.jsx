import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuestionBody from '@/features/community/components/QuestionBody';
import ReplyCard from '@/features/community/components/ReplyCard';
import ReplyForm from '@/features/community/components/ReplyForm';
import AISummary from '@/features/community/components/AISummary';
import { useCommunityStore } from '@/store/useCommunityStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ThreadDetailPage = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { getThreadById, currentThread, isLoading, error } = useCommunityStore();

  useEffect(() => {
    if (threadId) {
      getThreadById(threadId);
    }
  }, [threadId, getThreadById]);

  const handleReplySubmit = (content) => {
    console.log("New reply:", content);
    // TODO: Implement addReply action
  };

  if (isLoading) {
      return (
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-20 w-full" />
          </div>
      )
  }

  if (error || !currentThread) {
      return (
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
              <h2 className="text-xl font-bold mb-4">Thread not found</h2>
              <p className="text-muted-foreground mb-6">The discussion you are looking for does not exist or has been removed.</p>
              <Button onClick={() => navigate('/dashboard/community')}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Community
              </Button>
          </div>
      )
  }

  const { thread, replies } = currentThread;

  // Adapt backend data to frontend component expectation
  // Check if structure matches. Backend sends { thread: TThread, replies: TReply[] }
  // QuestionBody expects 'question' prop which is essentially the thread + author populated
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
       <div className="mb-6">
           <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/community')} className="mb-4 text-muted-foreground">
               <ArrowLeft className="mr-2 h-4 w-4" /> Back
           </Button>
           <QuestionBody question={thread} />
       </div>
       
       {thread.aiSummary && <AISummary summary={thread.aiSummary} />}

       <div className="space-y-8 mt-8">
          <div className="flex items-center justify-between border-b pb-4">
             <h2 className="text-xl font-bold">{replies?.length || 0} Answers</h2>
          </div>

          <div className="space-y-6">
             {replies?.map(reply => (
                <ReplyCard 
                   key={reply._id || reply.id} 
                   reply={reply} 
                   isAccepted={thread.isSolved && thread.acceptedAnswerId === (reply._id || reply.id)}
                />
             ))}
             {replies?.length === 0 && (
                 <p className="text-center text-muted-foreground py-8">No answers yet. Be the first to reply!</p>
             )}
          </div>

          <div className="pt-10">
             <ReplyForm onSubmit={handleReplySubmit} />
          </div>
       </div>
    </div>
  );
};

export default ThreadDetailPage;
