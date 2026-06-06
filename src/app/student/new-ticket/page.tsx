
'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { createTicket } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function NewTicketPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    
    try {
      await createTicket(formData);
      toast({
        title: "Ticket Raised Successfully",
        description: "AI has categorized and prioritized your issue for the admin.",
      });
      router.push('/student');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "Failed to raise the ticket. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="student" />
      <main className="container mx-auto py-12 px-4 max-w-2xl">
        <Card className="shadow-lg border-2">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
               <div className="bg-primary/10 p-2 rounded-lg">
                <Sparkles className="h-5 w-5 text-primary" />
               </div>
               <CardTitle className="text-2xl">Raise a Complaint</CardTitle>
            </div>
            <CardDescription className="text-base">
              Provide details about the issue. Our AI will automatically categorize and prioritize it for faster resolution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Issue Title</Label>
                <Input id="title" name="title" placeholder="e.g., Broken fan in my room" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hostelBlock">Hostel / Block</Label>
                  <Input id="hostelBlock" name="hostelBlock" placeholder="e.g., Block C" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roomNumber">Room Number</Label>
                  <Input id="roomNumber" name="roomNumber" placeholder="e.g., 204" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Describe the issue in detail. Mention urgency if any..." 
                  className="min-h-[150px]"
                  required 
                />
                <p className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                   <Sparkles className="h-3 w-3" /> AI will triage your priority based on this text.
                </p>
              </div>

              <Button type="submit" className="w-full h-12 text-lg font-semibold" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Triaging with AI...
                  </>
                ) : (
                  'Submit Complaint'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
