
'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { store, RentPayment } from '@/app/lib/store';
import { CreditCard, Calendar, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function RentTrackingPage() {
  const [payments, setPayments] = useState<RentPayment[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setPayments(store.getRentPayments());
  }, []);

  const handlePay = (id: string) => {
    store.payRent(id);
    setPayments([...store.getRentPayments()]);
    toast({
      title: "Payment Successful",
      description: "Your rent for this month has been recorded.",
    });
  };

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-28">
      <Navbar role="student" />
      <main className="container mx-auto px-6 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Rent & Finances</h1>
          <p className="text-muted-foreground">Track your monthly payments and utility dues.</p>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
           <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/20 rounded-xl">
                    <TrendingUp className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Rent</p>
                    <p className="text-2xl font-bold">$500.00</p>
                  </div>
                </div>
              </CardContent>
           </Card>
           <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-500/20 rounded-xl">
                    <Calendar className="text-amber-500 h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Next Due Date</p>
                    <p className="text-2xl font-bold">Nov 05</p>
                  </div>
                </div>
              </CardContent>
           </Card>
           <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/20 rounded-xl">
                    <CheckCircle2 className="text-emerald-500 h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="text-2xl font-bold">Clear</p>
                  </div>
                </div>
              </CardContent>
           </Card>
        </div>

        <Card className="glass-card overflow-hidden">
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Records of your past transactions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-2 rounded-full",
                      payment.status === 'Paid' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                    )}>
                      {payment.status === 'Paid' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-semibold">{payment.month}</p>
                      <p className="text-xs text-muted-foreground">Due: {payment.dueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-bold">${payment.amount}</p>
                      <Badge variant={payment.status === 'Paid' ? 'default' : 'secondary'} className="text-[10px] uppercase">
                        {payment.status}
                      </Badge>
                    </div>
                    {payment.status !== 'Paid' && (
                      <Button size="sm" onClick={() => handlePay(payment.id)}>Pay Now</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
