'use server';
/**
 * @fileOverview This file implements a Genkit flow for automatically categorizing and prioritizing student tickets.
 *
 * - adminTicketAutoPrioritization - A function that handles the automatic ticket categorization and prioritization process.
 * - AdminTicketAutoPrioritizationInput - The input type for the adminTicketAutoPrioritization function.
 * - AdminTicketAutoPrioritizationOutput - The return type for the adminTicketAutoPrioritization function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AdminTicketAutoPrioritizationInputSchema = z.object({
  description: z.string().describe('The detailed description of the student complaint.'),
});
export type AdminTicketAutoPrioritizationInput = z.infer<typeof AdminTicketAutoPrioritizationInputSchema>;

const AdminTicketAutoPrioritizationOutputSchema = z.object({
  category: z
    .enum(['Maintenance', 'Noise', 'Safety', 'Financial', 'Personal', 'Other'])
    .describe('The category of the complaint.'),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).describe('The priority level of the complaint.'),
});
export type AdminTicketAutoPrioritizationOutput = z.infer<typeof AdminTicketAutoPrioritizationOutputSchema>;

export async function adminTicketAutoPrioritization(
  input: AdminTicketAutoPrioritizationInput
): Promise<AdminTicketAutoPrioritizationOutput> {
  return adminTicketAutoPrioritizationFlow(input);
}

const adminTicketAutoPrioritizationPrompt = ai.definePrompt({
  name: 'adminTicketAutoPrioritizationPrompt',
  input: { schema: AdminTicketAutoPrioritizationInputSchema },
  output: { schema: AdminTicketAutoPrioritizationOutputSchema },
  prompt: `You are an AI assistant designed to triage student complaints for a hostel management system. Your task is to analyze the provided complaint description and automatically assign it a category and a priority level.

Available Categories: Maintenance, Noise, Safety, Financial, Personal, Other
Available Priorities: Low, Medium, High, Critical

Consider the urgency, potential impact on safety or well-being, and operational disruption when determining the priority.

Complaint Description: {{{description}}}`,
});

const adminTicketAutoPrioritizationFlow = ai.defineFlow(
  {
    name: 'adminTicketAutoPrioritizationFlow',
    inputSchema: AdminTicketAutoPrioritizationInputSchema,
    outputSchema: AdminTicketAutoPrioritizationOutputSchema,
  },
  async (input) => {
    const { output } = await adminTicketAutoPrioritizationPrompt(input);
    if (!output) {
      throw new Error('Failed to categorize and prioritize the ticket.');
    }
    return output;
  }
);
