
'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { store, Ticket, TicketStatus } from '@/app/lib/store';
import { updateStatus } from '@/app/lib/actions';
import { format } from 'date-fns';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setTickets(store.getTickets());
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatus(id, newStatus as TicketStatus);
      setTickets(store.getTickets());
      toast({
        title: "Status Updated",
        description: `Ticket ${id} is now ${newStatus}.`,
      });
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update ticket status.",
      });
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase()) ||
    t.hostelBlock.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="admin" />
      <main className="container mx-auto py-8 px-4 md:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Ticket Management</h1>
          <p className="text-muted-foreground text-lg">Detailed list of all student complaints across the hostel.</p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by ID, title, or block..." 
              className="pl-10" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all">
               <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="All Categories" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Noise">Noise</SelectItem>
                  <SelectItem value="Safety">Safety</SelectItem>
               </SelectContent>
            </Select>
            <Select defaultValue="newest">
               <SelectTrigger className="w-[150px]">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort By" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="priority">High Priority</SelectItem>
               </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[100px]">Ticket ID</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id} className="group hover:bg-muted/30 transition-all duration-200 cursor-default animate-scale-up">
                  <TableCell className="font-mono text-xs font-bold">{ticket.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">
                      {ticket.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{ticket.title}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">{ticket.description}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <p className="font-semibold">{ticket.hostelBlock}</p>
                      <p className="text-muted-foreground">Room {ticket.roomNumber}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={ticket.priority === 'Critical' || ticket.priority === 'High' ? 'destructive' : 'secondary'}
                      className="text-[10px] uppercase"
                    >
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={ticket.status === 'Resolved' ? 'default' : ticket.status === 'In Progress' ? 'secondary' : 'outline'}
                      className="text-[10px] uppercase"
                    >
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Select defaultValue={ticket.status} onValueChange={(val) => handleStatusChange(ticket.id, val)}>
                      <SelectTrigger className="w-[130px] h-8 text-xs ml-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTickets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No tickets found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
}
