import { z } from 'zod';

export const contactFormSchema = z.object({
  fullName: z.string().min(3, 'Tell us your full name').max(140),
  email: z.string().email('Use a valid email'),
  orgName: z.string().max(160).optional().or(z.literal('')),
  role: z.string().max(120).optional().or(z.literal('')),
  phone: z.string().max(40).optional().or(z.literal('')),
  topicKey: z.string().min(2, 'Pick a topic'),
  urgencyKey: z.string().min(2, 'Select urgency'),
  message: z.string().min(20, 'Share at least 20 characters').max(2000),
});

export const defaultContactValues = {
  fullName: '',
  email: '',
  orgName: '',
  role: '',
  phone: '',
  topicKey: '',
  urgencyKey: 'standard-week',
  message: '',
};
