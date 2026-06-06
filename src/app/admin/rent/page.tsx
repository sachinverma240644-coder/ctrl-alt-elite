'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { store, RentPayment } from '@/app/lib/store';
import { Search, CheckCircle2, Clock, AlertCircle, BarChart as BarChartIcon } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';

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

  const chartData = [
    { name: 'Paid', value: totalCollected, color: 'hsl(var(--primary))' },
    { name: 'Pending', value: totalPending, color: 'hsl(var(--accent))' },
    { name: 'Overdue', value: totalOverdue, color: 'hsl(var(--destructive))' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="admin" />
      <main className="container mx-auto py-8 px-4 md:px-8 mb-32">
        <header className="mb-10">
          <h1 className="text-4xl font-black tracking-tighter mb-2">Rent Tracker</h1>
          <p className="text-muted-foreground text-lg">Detailed financial analytics and student payment tracking.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
          <Card className="glass-card flex flex-col justify-center py-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-500 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Total Collected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalCollected.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="glass-card flex flex-col justify-center py-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-500 flex items-center gap-2">
                <Clock className="h-4 w-4" /> Total Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalPending.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="glass-card flex flex-col justify-center py-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-rose-500 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> Total Overdue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalOverdue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="glass-card bg-primary/5 border-primary/20">
             <CardHeader className="pb-2">
               <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary">System Health</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">Stable</div>
               <p className="text-[10px] text-muted-foreground mt-1">Payments within projected margins.</p>
             </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          <Card className="lg:col-span-2 glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChartIcon className="h-5 w-5 text-primary" /> Revenue Distribution
              </CardTitle>
              <CardDescription>Comparison of current month collection status.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] pt-6">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-card border p-3 rounded-xl shadow-2xl border-white/10">
                              <p className="text-xs font-bold uppercase tracking-tighter mb-1">{payload[0].name}</p>
                              <p className="text-lg font-black text-primary">${payload[0].value.toLocaleString()}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={60}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by student, room..." 
                className="pl-10 h-12 bg-card/40 border-white/5" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Card className="glass-card">
               <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Summary</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4 text-sm">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-muted-foreground">Total Invoices</span>
                    <span className="font-bold">{payments.length}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <span className="font-bold text-emerald-500">
                      {Math.round((payments.filter(p => p.status === 'Paid').length / payments.length) * 100)}%
                    </span>
                  </div>
               </CardContent>
            </Card>
          </div>
        </div>

        <Card className="glass-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-white/5 border-none">
                <TableHead className="font-bold">Student</TableHead>
                <TableHead className="font-bold">Room</TableHead>
                <TableHead className="font-bold">Month</TableHead>
                <TableHead className="font-bold">Amount</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="text-right font-bold">Paid Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((p) => (
                <TableRow key={p.id} className="hover:bg-white/5 transition-colors border-white/5">
                  <TableCell className="font-medium">{p.studentName}</TableCell>
                  <TableCell>Room {p.roomNumber}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.month}</TableCell>
                  <TableCell className="font-black">${p.amount}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === 'Paid' ? 'default' : p.status === 'Overdue' ? 'destructive' : 'secondary'} className="text-[10px] font-black uppercase tracking-widest px-2">
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground italic">
                    {p.paidDate ? new Date(p.paidDate).toLocaleDateString() : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
}
