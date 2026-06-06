'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createHostelRoom, getAiPriceSuggestion } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PostRoomPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [description, setDescription] = useState('');
  const [size, setSize] = useState('Single');
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);
  
  const router = useRouter();
  const { toast } = useToast();

  async function handleSuggestPrice() {
    if (!description || description.length < 10) {
      toast({ title: "More Details Needed", description: "Please provide a longer description for a better price suggestion." });
      return;
    }
    setIsSuggesting(true);
    try {
      const result = await getAiPriceSuggestion(description, size);
      setSuggestedPrice(result.suggestedPrice);
      toast({ title: "AI Price Suggested", description: result.reasoning });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to get price suggestion." });
    } finally {
      setIsSuggesting(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    formData.set('size', size);
    
    try {
      await createHostelRoom(formData);
      toast({ title: "Room Posted", description: "The room is now live for students to find." });
      router.push('/student/find-hostel');
    } catch (error) {
      toast({ variant: "destructive", title: "Submission Error", description: "Failed to post room." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="admin" />
      <main className="container mx-auto py-12 px-4 max-w-2xl mb-24">
        <Card className="shadow-lg border-2">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
               <div className="bg-primary/10 p-2 rounded-lg">
                <Building2 className="h-5 w-5 text-primary" />
               </div>
               <CardTitle className="text-2xl">Post New Room</CardTitle>
            </div>
            <CardDescription>
              List a new hostel room. Use our AI to set a competitive market price.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="block">Block Name</Label>
                  <Input id="block" name="block" placeholder="e.g., Block A" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roomNumber">Room Number</Label>
                  <Input id="roomNumber" name="roomNumber" placeholder="e.g., 101" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Room Size</Label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single Occupancy</SelectItem>
                    <SelectItem value="Double">Double Sharing</SelectItem>
                    <SelectItem value="Triple">Triple Sharing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amenities">Amenities (comma separated)</Label>
                <Input id="amenities" name="amenities" placeholder="e.g., AC, WiFi, Balcony" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Room Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the view, proximity to gym/mess, etc..." 
                  className="min-h-[100px]"
                  required 
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 text-xs" 
                  onClick={handleSuggestPrice}
                  disabled={isSuggesting}
                >
                  {isSuggesting ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Sparkles className="h-3 w-3 mr-2" />}
                  Get AI Price Suggestion
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Monthly Rent ($)</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  defaultValue={suggestedPrice || ''} 
                  key={suggestedPrice}
                  required 
                />
                {suggestedPrice && <p className="text-[10px] text-primary italic">AI suggested ${suggestedPrice} based on details.</p>}
              </div>

              <Button type="submit" className="w-full h-12 text-lg font-semibold" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Post Room Listing'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
