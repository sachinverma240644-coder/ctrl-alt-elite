import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { store } from '@/app/lib/store';
import { LayoutDashboard, Clock, CheckCircle2, AlertTriangle, ListFilter, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const tickets = store.getTickets();
  const payments = store.getRentPayments();
  
  const total = tickets.length;
  const pending = tickets.filter(t => t.status === 'Pending').length;
  const resolved = tickets.filter(t => t.status === 'Resolved').length;
  const highPriority = tickets.filter(t => t.priority === 'High' || t.priority === 'Critical').length;

  const unpaidCount = payments.filter(p => p.status !== 'Paid').length;

  const stats = [
    { label: 'Total Complaints', value: total, icon: LayoutDashboard, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Pending Issues', value: pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Unpaid Rent', value: unpaidCount, icon: Wallet, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: 'High Priority', value: highPriority, icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="admin" />
      <main className="container mx-auto py-8 px-4 md:px-8">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground text-lg">System-wide performance at a glance.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/rent">
                 <Wallet className="mr-2 h-4 w-4" /> Rent Tracker
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/tickets">
                 <ListFilter className="mr-2 h-4 w-4" /> Manage Tickets
              </Link>
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-2 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <div className={`${stat.bg} p-2 rounded-lg`}>
                   <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">Live updates across all blocks</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Priority Issues</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                 {tickets.filter(t => t.priority === 'High' || t.priority === 'Critical').slice(0, 5).map(t => (
                   <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">{t.title}</p>
                        <p className="text-xs text-muted-foreground">{t.hostelBlock} • Room {t.roomNumber}</p>
                      </div>
                      <Badge variant="destructive" className="text-[10px] uppercase">{t.priority}</Badge>
                   </div>
                 ))}
                 {highPriority === 0 && <p className="text-sm text-muted-foreground py-4 text-center">No high priority issues reported.</p>}
               </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rent Overview</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                 {payments.filter(p => p.status !== 'Paid').slice(0, 5).map(p => (
                   <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">{p.studentName}</p>
                        <p className="text-xs text-muted-foreground">Room {p.roomNumber} • {p.month}</p>
                      </div>
                      <Badge variant={p.status === 'Overdue' ? 'destructive' : 'secondary'} className="text-[10px] uppercase">
                        {p.status}
                      </Badge>
                   </div>
                 ))}
                 {unpaidCount === 0 && <p className="text-sm text-muted-foreground py-4 text-center">All rent payments are up to date.</p>}
               </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
