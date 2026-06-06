import { config } from 'dotenv';
config();

import '@/ai/flows/admin-ticket-auto-prioritization.ts';
import '@/ai/flows/lost-item-match.ts';
import '@/ai/flows/hostel-match.ts';
import '@/ai/flows/suggest-room-price-flow.ts';
import '@/ai/flows/describe-lost-item-flow.ts';
