import React from 'react';
import { Bold, Italic, List, Link as LinkIcon, Image as ImageIcon, AtSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Note: For a real production app, use use Tiptap or Slate.js
// This is a simplified visual representation for the UI task.

const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder,
  className 
}) => {
  return (
    <div className={cn("rounded-lg border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-input bg-muted/20">
        <ToolbarButton icon={Bold} title="Bold" />
        <ToolbarButton icon={Italic} title="Italic" />
        <div className="w-px h-4 bg-border mx-1" />
        <ToolbarButton icon={List} title="Bullet List" />
        <ToolbarButton icon={LinkIcon} title="Link" />
        <ToolbarButton icon={ImageIcon} title="Image" />
        <div className="w-px h-4 bg-border mx-1" />
        <ToolbarButton icon={AtSign} title="Mention" />
      </div>

      {/* Editor Area */}
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[150px] p-4 bg-transparent border-0 focus:outline-none resize-y text-sm"
      />
    </div>
  );
};

const ToolbarButton = ({ icon: Icon, title, onClick }) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
    onClick={onClick}
    title={title}
  >
    <Icon className="h-4 w-4" />
  </Button>
);

export default RichTextEditor;
