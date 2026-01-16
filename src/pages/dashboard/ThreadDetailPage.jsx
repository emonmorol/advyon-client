import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import QuestionBody from '@/features/community/components/QuestionBody';
import ReplyCard from '@/features/community/components/ReplyCard';
import ReplyForm from '@/features/community/components/ReplyForm';
import AISummary from '@/features/community/components/AISummary';
import { useCommunityStore } from '@/store/useCommunityStore';

const ThreadDetailPage = () => {
   const { threadId } = useParams();
   const { currentThread, isLoading, error, fetchThreadById, addReply, voteReply } = useCommunityStore();

   useEffect(() => {
      if (threadId) {
         fetchThreadById(threadId);
      }
   }, [threadId, fetchThreadById]);

   const handleReplySubmit = async (content) => {
      try {
         await addReply(threadId, content);
      } catch (err) {
         console.error('Failed to add reply:', err);
      }
   };

   // Loading state
   if (isLoading && !currentThread) {
      return (
         <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading thread...</p>
         </div>
      );
   }

   // Error state
   if (error || !currentThread) {
      return (
         <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <p className="text-destructive mb-4">{error || 'Thread not found'}</p>
            <Link
               to="/dashboard/community"
               className="text-primary hover:underline inline-flex items-center gap-2"
            >
               <ArrowLeft size={16} />
               Back to Community
            </Link>
         </div>
      );
   }

   const { thread, replies = [] } = currentThread;

   // Transform thread data to match QuestionBody expectations
   const questionData = {
      id: thread._id,
      title: thread.title,
      content: thread.content,
      author: {
         name: thread.author?.fullName || 'Anonymous',
         avatar: thread.author?.avatarUrl || '',
         role: thread.author?.role || 'Community Member',
      },
      createdAt: new Date(thread.createdAt),
      views: thread.views || 0,
      upvotes: thread.upvotes?.length || 0,
      category: thread.category,
      tags: thread.tags || [],
      isSolved: thread.isSolved,
      acceptedAnswerId: replies.find(r => r.isAcceptedAnswer)?._id,
   };

   // Transform replies to match ReplyCard expectations - include _id for voting
   const formattedReplies = replies.map(reply => ({
      _id: reply._id, // Include for voting
      id: reply._id,
      content: reply.content,
      author: {
         name: reply.author?.fullName || 'Anonymous',
         avatar: reply.author?.avatarUrl || '',
         role: reply.author?.role || 'Community Member',
         isLawyer: reply.author?.role === 'lawyer',
      },
      createdAt: new Date(reply.createdAt),
      upvotes: reply.upvotes?.length || 0,
      downvotes: reply.downvotes?.length || 0,
      isAccepted: reply.isAcceptedAnswer,
   }));

   return (
      <div className="max-w-4xl mx-auto px-4 py-8">
         {/* Back link */}
         <Link
            to="/dashboard/community"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 mb-6 transition-colors"
         >
            <ArrowLeft size={16} />
            Back to Community
         </Link>

         <div className="mb-8">
            <QuestionBody question={questionData} />
         </div>

         {/* AI Summary - only show if solved or has replies */}
         {(thread.isSolved || replies.length > 0) && (
            <AISummary summary={`This thread discusses "${thread.title}" in the ${thread.category} category.`} />
         )}

         <div className="space-y-8">
            <div className="flex items-center justify-between border-b pb-4">
               <h2 className="text-xl font-bold">{formattedReplies.length} {formattedReplies.length === 1 ? 'Answer' : 'Answers'}</h2>
            </div>

            {formattedReplies.length === 0 ? (
               <div className="text-center py-12 text-muted-foreground">
                  <p>No answers yet. Be the first to help!</p>
               </div>
            ) : (
               <div className="space-y-6">
                  {formattedReplies.map(reply => (
                     <ReplyCard
                        key={reply.id}
                        reply={reply}
                        isAccepted={reply.isAccepted}
                        onUpvote={() => voteReply(reply._id, 'up')}
                        onDownvote={() => voteReply(reply._id, 'down')}
                     />
                  ))}
               </div>
            )}

            <div className="pt-10">
               <ReplyForm onSubmit={handleReplySubmit} />
            </div>
         </div>
      </div>
   );
};

export default ThreadDetailPage;
