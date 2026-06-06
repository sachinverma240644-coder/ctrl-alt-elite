
import { AdminTicketAutoPrioritizationOutput } from '@/ai/flows/admin-ticket-auto-prioritization';

export type TicketStatus = 'Pending' | 'In Progress' | 'Resolved';

export interface Ticket extends AdminTicketAutoPrioritizationOutput {
  id: string;
  title: string;
  description: string;
  hostelBlock: string;
  roomNumber: string;
  status: TicketStatus;
  createdAt: string;
}

export interface LostAndFoundItem {
  id: string;
  type: 'Lost' | 'Found';
  title: string;
  description: string;
  location: string;
  contact: string;
  imageUrl?: string;
  createdAt: string;
}

// In a real app, this would be a database.
// For MVP/Demo purposes, we use a global variable to persist across HMR in dev if possible,
// or just simple initial data.
let tickets: Ticket[] = [
  {
    id: 'T-1001',
    title: 'Leaking Pipe',
    description: 'The bathroom pipe in 402 is leaking significantly.',
    hostelBlock: 'Block A',
    roomNumber: '402',
    category: 'Maintenance',
    priority: 'High',
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'T-1002',
    title: 'WiFi Connection Issue',
    description: 'WiFi is extremely slow since morning.',
    hostelBlock: 'Block B',
    roomNumber: '105',
    category: 'Other',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  }
];

let lostItems: LostAndFoundItem[] = [
  {
    id: 'LF-1',
    type: 'Found',
    title: 'Blue Water Bottle',
    description: 'Found a Nike water bottle near the gym area.',
    location: 'Gym Entrance',
    contact: 'Room 203',
    imageUrl: 'https://picsum.photos/seed/lost2/400/300',
    createdAt: new Date().toISOString(),
  }
];

export const store = {
  getTickets: () => tickets,
  addTicket: (ticket: Ticket) => { tickets = [ticket, ...tickets]; },
  updateTicketStatus: (id: string, status: TicketStatus) => {
    tickets = tickets.map(t => t.id === id ? { ...t, status } : t);
  },
  getLostItems: () => lostItems,
  addLostItem: (item: LostAndFoundItem) => { lostItems = [item, ...lostItems]; }
};
