'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { reportLostFound, getAiItemDescription } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';
import { Loader2, Camera, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ReportItemPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const router = useRouter();
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleAIDescribe() {
    if (!imagePreview) {
      toast({ title: "No Image", description: "Please upload a photo first." });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await getAiItemDescription(imagePreview);
      setTitle(result.title);
      setDescription(result.description);
      toast({ title: "AI Description Generated!", description: "We've filled out the details for you." });
    } catch (e) {
      toast({ variant: "destructive", title: "AI Error", description: "Failed to analyze the photo." });
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    if (imagePreview) formData.set('imageUrl', imagePreview);
    
    try {
      await reportLostFound(formData);
      toast({ title: "Item Reported", description: "Your post is now live on the community board." });
      router.push('/student/lost-and-found');
    } catch (error) {
      toast({ variant: "destructive", title: "Submission Error", description: "Failed to post the item." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="student" />
      <main className="container mx-auto py-12 px-4 max-w-xl mb-24">
        <Card className="shadow-lg border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Report Lost or Found Item</CardTitle>
            <CardDescription>
              Upload a photo and let AI fill in the details automatically.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative h-48 w-full border-2 border-dashed rounded-xl overflow-hidden group">
                {imagePreview ? (
                  <img src={imagePreview} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Camera className="h-10 w-10 mb-2" />
                    <p className="text-sm">Click to upload photo</p>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handleImageUpload}
                />
              </div>
              <Button 
                type="button" 
                className="w-full mt-4 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30"
                onClick={handleAIDescribe}
                disabled={!imagePreview || isGenerating}
              >
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                Use AI to Describe Item
              </Button>
            </div>

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
                <Input 
                  id="title" 
                  name="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" placeholder="e.g., Cafeteria" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact Information</Label>
                <Input id="contact" name="contact" placeholder="Room or Phone" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                  required 
                />
              </div>

              <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Post to Board'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
