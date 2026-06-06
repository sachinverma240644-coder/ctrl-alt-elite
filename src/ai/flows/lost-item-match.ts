
'use server';
/**
 * @fileOverview This flow matches reported lost items with found items based on description, location, and timestamp.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const LostItemMatchInputSchema = z.object({
  reportedItem: z.object({
    title: z.string(),
    description: z.string(),
    location: z.string(),
    timestamp: z.string(),
    type: z.enum(['Lost', 'Found']),
  }),
  potentialMatches: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    location: z.string(),
    timestamp: z.string(),
  })),
});

const LostItemMatchOutputSchema = z.object({
  matches: z.array(z.object({
    itemId: z.string(),
    confidence: z.number().describe('Confidence score from 0 to 1'),
    reasoning: z.string().describe('Why this is a potential match'),
  })),
});

export type LostItemMatchInput = z.infer<typeof LostItemMatchInputSchema>;
export type LostItemMatchOutput = z.infer<typeof LostItemMatchOutputSchema>;

export async function matchLostItems(input: LostItemMatchInput): Promise<LostItemMatchOutput> {
  const prompt = ai.definePrompt({
    name: 'lostItemMatchPrompt',
    input: { schema: LostItemMatchInputSchema },
    output: { schema: LostItemMatchOutputSchema },
    prompt: `You are an AI community assistant. Your goal is to match a recently reported {{reportedItem.type}} item with a list of potential items of the opposite type.

Reported Item:
- Title: {{reportedItem.title}}
- Description: {{reportedItem.description}}
- Location: {{reportedItem.location}}
- Time: {{reportedItem.timestamp}}

Potential Matches:
{{#each potentialMatches}}
- [ID: {{id}}] {{title}}: {{description}} (At: {{location}}, Time: {{timestamp}})
{{/each}}

Analyze descriptions for semantic similarity, check if the locations are near each other, and ensure the timestamps are logical (e.g., a "Found" item must be found AFTER a "Lost" item or within a reasonable window). Return matches sorted by confidence.`,
  });

  const { output } = await prompt(input);
  return output!;
}
