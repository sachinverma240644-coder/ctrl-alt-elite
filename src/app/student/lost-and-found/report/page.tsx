
'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { reportLostFound } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ReportItemPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    
    try {
      await reportLostFound(formData);
      toast({
        title: "Item Reported",
        description: "Your post is now live on the community board.",
      });
      router.push('/student/lost-and-found');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "Failed to post the item. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="student" />
      <main className="container mx-auto py-12 px-4 max-w-xl">
        <Card className="shadow-lg border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Report Lost or Found Item</CardTitle>
            <CardDescription>
              Provide clear details and contact info to help the item return to its owner.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label>Item Type</Label>
                <RadioGroup defaultValue="Lost" name="type" className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Lost" id="lost" />
                    <Label htmlFor="lost" className="font-normal">I lost something</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Found" id="found" />
                    <Label htmlFor="found" className="font-normal">I found something</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Item Name</Label>
                <Input id="title" name="title" placeholder="e.g., iPhone 13, Wallet, Keys" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Last Seen / Found Location</Label>
                <Input id="location" name="location" placeholder="e.g., Cafeteria, Basketball Court" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact Information</Label>
                <Input id="contact" name="contact" placeholder="Room number or Phone" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Mention color, brand, or any identifying marks..." 
                  className="min-h-[100px]"
                  required 
                />
              </div>

              <div className="pt-4 flex gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-accent hover:bg-accent/90" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Post to Board'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
