'use server';
/**
 * @fileOverview This flow uses multimodal AI to describe a lost or found item from a photo.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DescribeItemInputSchema = z.object({
  photoDataUri: z.string().describe("A photo of the item as a data URI."),
});

const DescribeItemOutputSchema = z.object({
  title: z.string().describe('A short, catchy title for the item.'),
  description: z.string().describe('A detailed description of the item.'),
});

export type DescribeItemInput = z.infer<typeof DescribeItemInputSchema>;
export type DescribeItemOutput = z.infer<typeof DescribeItemOutputSchema>;

export async function describeItemFromPhoto(input: DescribeItemInput): Promise<DescribeItemOutput> {
  const prompt = ai.definePrompt({
    name: 'describeItemPrompt',
    input: { schema: DescribeItemInputSchema },
    output: { schema: DescribeItemOutputSchema },
    prompt: `Analyze this image of a lost or found item. Provide a clear title and a detailed description including color, brand, and condition.
    
    Photo: {{media url=photoDataUri}}`,
  });

  const { output } = await prompt(input);
  return output!;
}
