import { z } from 'zod';

export const COMMUNITY_CATEGORY_IDS = [
  'family',
  'criminal',
  'civil',
  'property',
  'corporate',
  'ip',
  'others',
];

export const COMMUNITY_CATEGORY_LABELS = [
  'Family Law',
  'Criminal Defense',
  'Civil Litigation',
  'Property Law',
  'Corporate',
  'Intellectual Property',
  'Others',
];

const validCategoryValues = new Set([
  ...COMMUNITY_CATEGORY_IDS,
  ...COMMUNITY_CATEGORY_LABELS,
]);

export const createThreadSchema = z.object({
  title: z.string().trim().min(8, 'Title must be at least 8 characters').max(180),
  category: z
    .string()
    .trim()
    .min(1, 'Category is required')
    .refine(value => value !== 'all', 'Please select a specific category')
    .refine(value => validCategoryValues.has(value), 'Please select a valid category'),
  content: z
    .string()
    .trim()
    .min(20, 'Details must be at least 20 characters')
    .max(5000),
  tags: z.array(z.string().trim().min(1).max(40)).max(10),
});

export const replySchema = z.object({
  content: z
    .string()
    .trim()
    .min(5, 'Reply must be at least 5 characters')
    .max(5000),
});

export const aiToolInputSchema = z
  .string()
  .trim()
  .min(10, 'Please provide at least 10 characters')
  .max(8000, 'Input is too long');
