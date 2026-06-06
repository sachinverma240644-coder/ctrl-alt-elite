
'use server';

import { adminTicketAutoPrioritization } from '@/ai/flows/admin-ticket-auto-prioritization';
import { matchLostItems } from '@/ai/flows/lost-item-match';
import { store, Ticket, LostAndFoundItem, TicketStatus } from './store';
import { revalidatePath } from 'next/cache';

export async function createTicket(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const hostelBlock = formData.get('hostelBlock') as string;
  const roomNumber = formData.get('roomNumber') as string;

  const aiResult = await adminTicketAutoPrioritization({ description });

  const newTicket: Ticket = {
    id: `T-${Math.floor(1000 + Math.random() * 9000)}`,
    title,
    description,
    hostelBlock,
    roomNumber,
    category: aiResult.category,
    priority: aiResult.priority,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  store.addTicket(newTicket);
  revalidatePath('/student');
  revalidatePath('/admin');
  return { success: true };
}

export async function updateStatus(ticketId: string, status: TicketStatus) {
  store.updateTicketStatus(ticketId, status);
  revalidatePath('/admin');
  return { success: true };
}

export async function reportLostFound(formData: FormData) {
  const type = formData.get('type') as 'Lost' | 'Found';
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const location = formData.get('location') as string;
  const contact = formData.get('contact') as string;

  const newItem: LostAndFoundItem = {
    id: `LF-${Math.floor(100 + Math.random() * 900)}`,
    type,
    title,
    description,
    location,
    contact,
    imageUrl: `https://picsum.photos/seed/${Math.random()}/400/300`,
    createdAt: new Date().toISOString(),
    timestamp: new Date().toISOString(),
  };

  store.addLostItem(newItem);
  revalidatePath('/student/lost-and-found');
  return { success: true };
}

export async function getAIMatches(itemId: string) {
  const items = store.getLostItems();
  const target = items.find(i => i.id === itemId);
  if (!target) return [];

  const others = items.filter(i => i.type !== target.type);
  const result = await matchLostItems({
    reportedItem: {
      title: target.title,
      description: target.description,
      location: target.location,
      timestamp: target.timestamp,
      type: target.type,
    },
    potentialMatches: others.map(i => ({
      id: i.id,
      title: i.title,
      description: i.description,
      location: i.location,
      timestamp: i.timestamp,
    })),
  });

  return result.matches;
}
