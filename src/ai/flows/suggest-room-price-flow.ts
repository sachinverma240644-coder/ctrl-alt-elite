'use server';
/**
 * @fileOverview This flow suggests an appropriate market price for a room.
 *
 * - suggestRoomPrice - A function that handles the price suggestion process.
 * - SuggestPriceInput - The input type for the function.
 * - SuggestPriceOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestPriceInputSchema = z.object({
  description: z.string().describe('Detailed description of the room including amenities.'),
  size: z.enum(['Single', 'Double', 'Triple']),
});
export type SuggestPriceInput = z.infer<typeof SuggestPriceInputSchema>;

const SuggestPriceOutputSchema = z.object({
  suggestedPrice: z.number().describe('The suggested monthly rent in USD.'),
  reasoning: z.string().describe('Brief explanation of why this price was suggested.'),
});
export type SuggestPriceOutput = z.infer<typeof SuggestPriceOutputSchema>;

const suggestRoomPricePrompt = ai.definePrompt({
  name: 'suggestRoomPricePrompt',
  input: { schema: SuggestPriceInputSchema },
  output: { schema: SuggestPriceOutputSchema },
  prompt: `You are a real estate analyst for campus housing. Suggest a fair monthly rent for the following room.
    
    Room Size: {{size}}
    Description: {{description}}
    
    Consider standard rates: Single ($400-600), Double ($300-450), Triple ($200-350). Adjust based on amenities mentioned (AC, Balcony, WiFi etc).`,
});

const suggestRoomPriceFlow = ai.defineFlow(
  {
    name: 'suggestRoomPriceFlow',
    inputSchema: SuggestPriceInputSchema,
    outputSchema: SuggestPriceOutputSchema,
  },
  async (input) => {
    const { output } = await suggestRoomPricePrompt(input);
    if (!output) {
      throw new Error('Failed to suggest room price.');
    }
    return output;
  }
);

export async function suggestRoomPrice(input: SuggestPriceInput): Promise<SuggestPriceOutput> {
  return suggestRoomPriceFlow(input);
}
