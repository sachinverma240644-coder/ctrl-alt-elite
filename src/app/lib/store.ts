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
  timestamp: string;
}

export interface RentPayment {
  id: string;
  studentName: string;
  roomNumber: string;
  month: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: string;
  paidDate?: string;
  marketRate: number;
}

export interface HostelRoom {
  id: string;
  block: string;
  roomNumber: string;
  price: number;
  size: 'Single' | 'Double' | 'Triple';
  amenities: string[];
  description: string;
  isAvailable: boolean;
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
    studentName: 'Alex Johnson',
    roomNumber: '101',
    month: 'Oct 2023',
    amount: 500,
    status: 'Paid',
    dueDate: '2023-10-05',
    paidDate: '2023-10-02',
    marketRate: 500,
  },
  {
    id: 'R-2',
    studentName: 'Alex Johnson',
    roomNumber: '101',
    month: 'Nov 2023',
    amount: 550,
    status: 'Pending',
    dueDate: '2023-11-05',
    marketRate: 500,
  },
  {
    id: 'R-3',
    studentName: 'Sarah Smith',
    roomNumber: '204',
    month: 'Nov 2023',
    amount: 500,
    status: 'Overdue',
    dueDate: '2023-11-05',
    marketRate: 500,
  },
  {
    id: 'R-4',
    studentName: 'David Lee',
    roomNumber: '305',
    month: 'Nov 2023',
    amount: 450,
    status: 'Paid',
    dueDate: '2023-11-05',
    paidDate: '2023-11-04',
    marketRate: 500,
  }
];

let hostelRooms: HostelRoom[] = [
  {
    id: 'HR-1',
    block: 'Block A',
    roomNumber: '101',
    price: 500,
    size: 'Single',
    amenities: ['AC', 'Attached Bath', 'Balcony'],
    description: 'Premium single room with park view and high-speed wifi.',
    isAvailable: true,
  },
  {
    id: 'HR-2',
    block: 'Block B',
    roomNumber: '205',
    price: 350,
    size: 'Double',
    amenities: ['Fan', 'Shared Bath'],
    description: 'Affordable double sharing near the student mess.',
    isAvailable: true,
  },
  {
    id: 'HR-3',
    block: 'Block C',
    roomNumber: '302',
    price: 450,
    size: 'Single',
    amenities: ['AC', 'Gym Access'],
    description: 'Modern room located right next to the campus gym.',
    isAvailable: true,
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
  },
  getHostelRooms: () => hostelRooms,
  addHostelRoom: (room: HostelRoom) => { hostelRooms = [room, ...hostelRooms]; },
};
