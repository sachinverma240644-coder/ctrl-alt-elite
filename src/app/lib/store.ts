
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
  timestamp: string; // Detailed ISO timestamp for AI matching
}

export interface RentPayment {
  id: string;
  month: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: string;
  paidDate?: string;
}

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
    timestamp: new Date().toISOString(),
  }
];

let rentPayments: RentPayment[] = [
  {
    id: 'R-1',
    month: 'October 2023',
    amount: 500,
    status: 'Paid',
    dueDate: '2023-10-05',
    paidDate: '2023-10-02',
  },
  {
    id: 'R-2',
    month: 'November 2023',
    amount: 500,
    status: 'Pending',
    dueDate: '2023-11-05',
  }
];

export const store = {
  getTickets: () => tickets,
  addTicket: (ticket: Ticket) => { tickets = [ticket, ...tickets]; },
  updateTicketStatus: (id: string, status: TicketStatus) => {
    tickets = tickets.map(t => t.id === id ? { ...t, status } : t);
  },
  getLostItems: () => lostItems,
  addLostItem: (item: LostAndFoundItem) => { lostItems = [item, ...lostItems]; },
  getRentPayments: () => rentPayments,
  payRent: (id: string) => {
    rentPayments = rentPayments.map(r => r.id === id ? { ...r, status: 'Paid', paidDate: new Date().toISOString() } : r);
  }
};
