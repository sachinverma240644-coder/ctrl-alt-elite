'use server';
/**
 * @fileOverview This flow suggests an appropriate market price for a room based on its description and amenities.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestPriceInputSchema = z.object({
  description: z.string().describe('Detailed description of the room including amenities.'),
  size: z.enum(['Single', 'Double', 'Triple']),
});

const SuggestPriceOutputSchema = z.object({
  suggestedPrice: z.number().describe('The suggested monthly rent in USD.'),
  reasoning: z.string().describe('Brief explanation of why this price was suggested.'),
});

export type SuggestPriceInput = z.infer<typeof SuggestPriceInputSchema>;
export type SuggestPriceOutput = z.infer<typeof SuggestPriceOutputSchema>;

export async function suggestRoomPrice(input: SuggestPriceInput): Promise<SuggestPriceOutput> {
  const prompt = ai.definePrompt({
    name: 'suggestRoomPricePrompt',
    input: { schema: SuggestPriceInputSchema },
    output: { schema: SuggestPriceOutputSchema },
    prompt: `You are a real estate analyst for campus housing. Suggest a fair monthly rent for the following room.
    
    Room Size: {{size}}
    Description: {{description}}
    
    Consider standard rates: Single ($400-600), Double ($300-450), Triple ($200-350). Adjust based on amenities mentioned (AC, Balcony, WiFi etc).`,
  });

  const { output } = await prompt(input);
  return output!;
}
