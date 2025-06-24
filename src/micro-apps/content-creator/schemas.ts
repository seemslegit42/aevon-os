
import { z } from 'zod';

export const formSchema = z.object({
  topic: z.string().min(5, { message: 'Topic must be at least 5 characters long.' }),
  contentType: z.enum(['Blog Post', 'Tweet', 'Marketing Email']),
  tone: z.enum(['Professional', 'Casual', 'Humorous', 'Persuasive']),
});

export type FormData = z.infer<typeof formSchema>;
