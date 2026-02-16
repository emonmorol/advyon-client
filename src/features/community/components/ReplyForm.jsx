import React, { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { useCommunityStore } from '@/store/useCommunityStore';

const ReplyForm = ({ onSubmit, threadId }) => {
  const [content, setContent] = useState('');
  const { fetchAnswerSuggestion, answerSuggestion, isLoadingAssist } = useCommunityStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  const handleGenerateSuggestion = async () => {
    const suggestion = await fetchAnswerSuggestion({
      threadId,
      draft: content || undefined,
    });

    if (suggestion) {
      setContent(suggestion);
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
          {answerSuggestion && (
            <p className="text-xs text-muted-foreground">
              AI suggestion loaded. Edit before posting if needed.
            </p>
          )}
          <div className="flex justify-end">
             <Button
                type="button"
                variant="outline"
                disabled={isLoadingAssist}
                onClick={handleGenerateSuggestion}
                className="mr-2"
             >
                {isLoadingAssist ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Suggest Answer
             </Button>
             <Button type="submit" disabled={!content.trim()} className="min-w-[120px]">
                Post Answer
             </Button>
          </div>
       </form>
    </div>
  );
};

export default ReplyForm;
