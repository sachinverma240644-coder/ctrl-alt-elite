'use server';
/**
 * @fileOverview This flow matches student requirements with available hostel rooms.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const HostelMatchInputSchema = z.object({
  requirements: z.string().describe('The student specific requirements (e.g., "quiet area", "near gym", "budget under 400")'),
  availableRooms: z.array(z.object({
    id: z.string(),
    block: z.string(),
    roomNumber: z.string(),
    price: z.number(),
    size: z.string(),
    amenities: z.array(z.string()),
    description: z.string(),
  })),
});

const HostelMatchOutputSchema = z.object({
  suggestions: z.array(z.object({
    roomId: z.string(),
    matchScore: z.number().describe('How well it fits on a scale of 0 to 1'),
    reasoning: z.string().describe('Why this room is a good fit for the requirements'),
  })),
});

export type HostelMatchInput = z.infer<typeof HostelMatchInputSchema>;
export type HostelMatchOutput = z.infer<typeof HostelMatchOutputSchema>;

export async function matchHostelsAI(input: HostelMatchInput): Promise<HostelMatchOutput> {
  const prompt = ai.definePrompt({
    name: 'hostelMatchPrompt',
    input: { schema: HostelMatchInputSchema },
    output: { schema: HostelMatchOutputSchema },
    prompt: `You are an AI Campus Concierge. Match the following student requirements with available hostel rooms.

Student Requirements:
{{{requirements}}}

Available Rooms:
{{#each availableRooms}}
- [ID: {{id}}] {{block}} Room {{roomNumber}}: {{size}} - ${{price}}. Features: {{#each amenities}}{{this}}, {{/each}}. {{description}}
{{/each}}

Analyze the requirements against the prices, amenities, and descriptions. Return the top 3 suggestions with detailed reasoning for each.`,
  });

  const { output } = await prompt(input);
  return output!;
}