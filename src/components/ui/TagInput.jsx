import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TagInput = ({ 
  tags = [], 
  onChange, 
  suggestions = [], 
  placeholder = "Add a tag...",
  className 
}) => {
  const [input, setInput] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  useEffect(() => {
    if (input.trim()) {
      const filtered = suggestions.filter(s => 
        s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }, [input, suggestions, tags]);

  const addTag = (tag) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      onChange([...tags, tag.trim()]);
      setInput('');
      setFilteredSuggestions([]);
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap gap-2 p-2 rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-ring min-h-[3rem]">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="p-0.5 hover:bg-muted-foreground/20 rounded-full transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm p-1"
        />
      </div>

      {filteredSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="text-muted-foreground py-1">Suggestions:</span>
          {filteredSuggestions.map((suggestion) => (
            <Button
              key={suggestion}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addTag(suggestion)}
              className="h-7 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              {suggestion}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagInput;
