'use server';
/**
 * @fileOverview This flow matches reported lost items with found items.
 *
 * - matchLostItems - A function that handles the lost item matching process.
 * - LostItemMatchInput - The input type for the function.
 * - LostItemMatchOutput - The return type for the function.
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
export type LostItemMatchInput = z.infer<typeof LostItemMatchInputSchema>;

const LostItemMatchOutputSchema = z.object({
  matches: z.array(z.object({
    itemId: z.string(),
    confidence: z.number().describe('Confidence score from 0 to 1'),
    reasoning: z.string().describe('Why this is a potential match'),
  })),
});
export type LostItemMatchOutput = z.infer<typeof LostItemMatchOutputSchema>;

const lostItemMatchPrompt = ai.definePrompt({
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

Analyze descriptions for semantic similarity, check if the locations are near each other, and ensure the timestamps are logical. Return matches sorted by confidence.`,
});

const lostItemMatchFlow = ai.defineFlow(
  {
    name: 'lostItemMatchFlow',
    inputSchema: LostItemMatchInputSchema,
    outputSchema: LostItemMatchOutputSchema,
  },
  async (input) => {
    const { output } = await lostItemMatchPrompt(input);
    if (!output) {
      throw new Error('Failed to match lost items.');
    }
    return output;
  }
);

export async function matchLostItems(input: LostItemMatchInput): Promise<LostItemMatchOutput> {
  return lostItemMatchFlow(input);
}
