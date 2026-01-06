import React from 'react';
import { useParams } from 'react-router-dom';
import QuestionBody from '@/features/community/components/QuestionBody';
import ReplyCard from '@/features/community/components/ReplyCard';
import ReplyForm from '@/features/community/components/ReplyForm';
import AISummary from '@/features/community/components/AISummary';

// Mock Data
const MOCK_THREAD = {
  id: '123',
  title: 'Can I claim maintenance if I\'m working but earn significantly less than my spouse?',
  content: 'I am going through a divorce proceedings. My husband earns 5x more than me. Even though I am employed, my salary is barely enough to cover my basic living expenses in this city. Am I eligible to claim interim maintenance? What factors will the court consider?',
  author: { name: 'Sarah J.', avatar: '', role: 'Community Member' },
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  views: 1250,
  upvotes: 45,
  downvotes: 2,
  category: 'Family Law',
  tags: ['Divorce', 'Maintenance', 'Alimony'],
  isSolved: true,
  acceptedAnswerId: 'r1',
  aiSummary: 'Under Section 24 of the Hindu Marriage Act, either spouse can claim maintenance if they do not have sufficient independent income. Courts consider the "status and standard of living" of the parties. The fact that the wife is working does not automatically disqualify her from claiming maintenance if her income is insufficient to maintain the standard of living she was accustomed to in the matrimonial home.',
  replies: [
    {
      id: 'r1',
      content: 'Yes, you can absolutely claim maintenance. The Supreme Court has clarified in multiple judgments (like Rajnesh v. Neha) that the capacity to earn or the fact that the wife is earning does not bar her from claiming maintenance. The court looks at the "lifestyle" you were used to. If there is a massive disparity in income (like 5x as you mentioned), the court usually grants maintenance to bridge that gap.',
      author: { name: 'Adv. Rajesh Kumar', avatar: '', role: 'Family Lawyer', isLawyer: true },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      upvotes: 28,
      downvotes: 0
    },
    {
      id: 'r2',
      content: 'Make sure you file an affidavit of assets and liabilities correctly. That is crucial now for deciding the quantum of maintenance.',
      author: { name: 'Priya S.', avatar: '', role: 'Community Member', isLawyer: false },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
      upvotes: 5,
      downvotes: 0
    }
  ]
};

const ThreadDetailPage = () => {
  const { threadId } = useParams();
  // Fetch logic would go here

  const handleReplySubmit = (content) => {
    console.log("New reply:", content);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
       <div className="mb-8">
          <QuestionBody question={MOCK_THREAD} />
       </div>
       
       <AISummary summary={MOCK_THREAD.aiSummary} />

       <div className="space-y-8">
          <div className="flex items-center justify-between border-b pb-4">
             <h2 className="text-xl font-bold">{MOCK_THREAD.replies.length} Answers</h2>
             {/* Sort dropdown could go here */}
          </div>

          <div className="space-y-6">
             {MOCK_THREAD.replies.map(reply => (
                <ReplyCard 
                   key={reply.id} 
                   reply={reply} 
                   isAccepted={MOCK_THREAD.acceptedAnswerId === reply.id}
                />
             ))}
          </div>

          <div className="pt-10">
             <ReplyForm onSubmit={handleReplySubmit} />
          </div>
       </div>
    </div>
  );
};

export default ThreadDetailPage;
