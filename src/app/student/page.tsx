
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { store } from '@/app/lib/store';
import { Clock, CheckCircle2, AlertCircle, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function StudentDashboard() {
  const tickets = store.getTickets();

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="student" />
      <main className="container mx-auto py-8 px-4 md:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Complaints</h1>
          <p className="text-muted-foreground text-lg">Track the status of your reported issues.</p>
        </header>

        {tickets.length === 0 ? (
          <Card className="border-dashed py-12 text-center">
            <CardContent className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-muted flex items-center justify-center rounded-full">
                <Clock className="text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-lg">No tickets found</p>
                <p className="text-muted-foreground">You haven't raised any complaints yet.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{ticket.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {ticket.hostelBlock}, Room {ticket.roomNumber}
                      </span>
                      <span>ID: {ticket.id}</span>
                      <span>{formatDistanceToNow(new Date(ticket.createdAt))} ago</span>
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge 
                      variant={ticket.status === 'Resolved' ? 'default' : ticket.status === 'In Progress' ? 'secondary' : 'outline'}
                      className="px-3 py-1 text-xs uppercase tracking-wider"
                    >
                      {ticket.status}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] text-muted-foreground border-muted-foreground/30">
                      {ticket.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 mb-4">{ticket.description}</p>
                  <div className="flex items-center gap-2">
                    {ticket.status === 'Pending' && <Clock className="h-4 w-4 text-amber-500" />}
                    {ticket.status === 'In Progress' && <AlertCircle className="h-4 w-4 text-blue-500" />}
                    {ticket.status === 'Resolved' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                    <span className="text-xs font-medium uppercase text-muted-foreground">
                      {ticket.status === 'Pending' ? 'Waiting for admin review' : ticket.status === 'In Progress' ? 'Technician assigned' : 'Issue solved'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
