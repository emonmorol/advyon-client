import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RichTextEditor from '@/components/ui/RichTextEditor';

const ReplyForm = ({ onSubmit }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  return (
    <div className="space-y-4">
       <h3 className="text-lg font-semibold">Your Answer</h3>
       <form onSubmit={handleSubmit} className="space-y-4">
          <RichTextEditor 
             value={content}
             onChange={setContent}
             placeholder="Write a helpful, detailed answer..."
             className="min-h-[200px]"
          />
          <div className="flex justify-end">
             <Button type="submit" disabled={!content.trim()} className="min-w-[120px]">
                Post Answer
             </Button>
          </div>
       </form>
    </div>
  );
};

export default ReplyForm;
