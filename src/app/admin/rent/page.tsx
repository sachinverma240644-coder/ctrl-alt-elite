'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { store, RentPayment } from '@/app/lib/store';
import { Search, DollarSign, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminRentTrackerPage() {
  const [payments, setPayments] = useState<RentPayment[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setPayments(store.getRentPayments());
  }, []);

  const filteredPayments = payments.filter(p => 
    p.studentName.toLowerCase().includes(search.toLowerCase()) ||
    p.roomNumber.includes(search) ||
    p.month.toLowerCase().includes(search.toLowerCase())
  );

  const totalCollected = payments.filter(p => p.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
  const totalPending = payments.filter(p => p.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);
  const totalOverdue = payments.filter(p => p.status === 'Overdue').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="admin" />
      <main className="container mx-auto py-8 px-4 md:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Rent Tracker</h1>
          <p className="text-muted-foreground text-lg">Financial overview and student payment statuses.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Card className="bg-emerald-500/5 border-emerald-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-500 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Total Collected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalCollected.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="bg-amber-500/5 border-amber-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-500 flex items-center gap-2">
                <Clock className="h-4 w-4" /> Total Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalPending.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="bg-rose-500/5 border-rose-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-rose-500 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> Total Overdue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalOverdue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by student, room, or month..." 
            className="pl-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Student</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Paid Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.studentName}</TableCell>
                  <TableCell>Room {p.roomNumber}</TableCell>
                  <TableCell>{p.month}</TableCell>
                  <TableCell className="font-semibold">${p.amount}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === 'Paid' ? 'default' : p.status === 'Overdue' ? 'destructive' : 'secondary'} className="text-[10px] uppercase">
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.dueDate}</TableCell>
                  <TableCell className="text-right text-xs">
                    {p.paidDate ? new Date(p.paidDate).toLocaleDateString() : '-'}
                  </TableCell>
                </TableRow>
              ))}
              {filteredPayments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No payment records found.
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
