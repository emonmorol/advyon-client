import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Send, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RichTextEditor from '@/components/ui/RichTextEditor';
import TagInput from '@/components/ui/TagInput';

const questionSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  category: z.string().min(1, 'Please select a category'),
  content: z.string().min(20, 'Please provide more details (at least 20 characters)'),
  tags: z.array(z.string()).max(5, 'You can add up to 5 tags'),
});

const QuestionForm = ({ onSubmit, isSubmitting }) => {
  const form = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: '',
      category: '',
      content: '',
      tags: [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Can I claim maintenance if I'm working?" {...field} />
              </FormControl>
              <FormDescription>
                Be specific and concise. Imagine you're asking a person.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Legal Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="family">Family Law</SelectItem>
                    <SelectItem value="civil">Civil Litigation</SelectItem>
                    <SelectItem value="criminal">Criminal Defense</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="property">Property</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (Optional)</FormLabel>
                <FormControl>
                  <TagInput 
                    tags={field.value}
                    onChange={field.onChange}
                    suggestions={['Divorce', 'Alimony', 'Maintenance', 'Fraud', 'Contract']}
                    placeholder="Add relevant tags"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detailed Description</FormLabel>
              <FormControl>
                {/* Wrapping in a Controller component or manual integration depending on the editor */}
                <RichTextEditor 
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Describe your legal situation in detail..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Disclaimer</p>
            <p className="opacity-90">
              The advice provided on this forum is for informational purposes only and does not constitute an attorney-client relationship. Please consult a qualified lawyer for your specific case.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" size="lg" disabled={isSubmitting} className="min-w-[150px] gap-2">
            Ask Question
            {isSubmitting ? (
              <span className="animate-pulse">...</span>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuestionForm;
