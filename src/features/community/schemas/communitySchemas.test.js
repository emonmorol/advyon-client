import { describe, expect, it } from 'vitest';
import {
  aiToolInputSchema,
  createThreadSchema,
  replySchema,
} from './communitySchemas';

describe('communitySchemas', () => {
  it('validates create-thread payload', () => {
    const result = createThreadSchema.safeParse({
      title: 'Need help with contract breach timeline',
      category: 'Family Law',
      content: 'I need legal guidance on filing deadlines and evidence handling.',
      tags: ['contract', 'timeline'],
    });

    expect(result.success).toBe(true);
  });

  it('rejects short replies', () => {
    const result = replySchema.safeParse({ content: 'ok' });
    expect(result.success).toBe(false);
  });

  it('requires minimum AI tool input length', () => {
    const result = aiToolInputSchema.safeParse('short');
    expect(result.success).toBe(false);
  });
});

