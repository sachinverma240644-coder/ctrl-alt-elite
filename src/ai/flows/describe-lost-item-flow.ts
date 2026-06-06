'use server';
/**
 * @fileOverview This flow uses multimodal AI to describe a lost or found item from a photo.
 *
 * - describeItemFromPhoto - A function that handles the item description process.
 * - DescribeItemInput - The input type for the function.
 * - DescribeItemOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DescribeItemInputSchema = z.object({
  photoDataUri: z.string().describe("A photo of the item as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type DescribeItemInput = z.infer<typeof DescribeItemInputSchema>;

const DescribeItemOutputSchema = z.object({
  title: z.string().describe('A short, catchy title for the item.'),
  description: z.string().describe('A detailed description of the item including color, brand, and condition.'),
});
export type DescribeItemOutput = z.infer<typeof DescribeItemOutputSchema>;

const describeItemPrompt = ai.definePrompt({
  name: 'describeItemPrompt',
  input: { schema: DescribeItemInputSchema },
  output: { schema: DescribeItemOutputSchema },
  prompt: `Analyze this image of a lost or found item. Provide a clear title and a detailed description.
    
    Photo: {{media url=photoDataUri}}`,
});

const describeItemFlow = ai.defineFlow(
  {
    name: 'describeItemFlow',
    inputSchema: DescribeItemInputSchema,
    outputSchema: DescribeItemOutputSchema,
  },
  async (input) => {
    const { output } = await describeItemPrompt(input);
    if (!output) {
      throw new Error('Failed to generate description from photo.');
    }
    return output;
  }
);

export async function describeItemFromPhoto(input: DescribeItemInput): Promise<DescribeItemOutput> {
  return describeItemFlow(input);
}
