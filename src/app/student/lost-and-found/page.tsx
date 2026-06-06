
'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { store, LostAndFoundItem } from '@/app/lib/store';
import { MapPin, Phone, Calendar, Plus, Box, Sparkles, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';
import { getAIMatches } from '@/app/lib/actions';
import { useToast } from '@/hooks/use-toast';

export default function LostAndFoundPage() {
  const [items, setItems] = useState<LostAndFoundItem[]>([]);
  const [matchingId, setMatchingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setItems(store.getLostItems());
  }, []);

  const handleAIMatch = async (id: string) => {
    setMatchingId(id);
    try {
      const matches = await getAIMatches(id);
      if (matches.length > 0) {
        toast({
          title: "AI Match Found!",
          description: `Found ${matches.length} potential matches for your item.`,
        });
      } else {
        toast({
          title: "No Matches Yet",
          description: "AI couldn't find a direct match. We'll notify you if one appears.",
        });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "AI Error", description: "Failed to run matchmaking." });
    } finally {
      setMatchingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-28">
      <Navbar role="student" />
      <main className="container mx-auto px-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Lost & Found Hub</h1>
            <p className="text-muted-foreground text-lg">AI-Powered matchmaking for the campus community.</p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90 rounded-full h-12 px-8">
            <Link href="/student/lost-and-found/report">
              <Plus className="mr-2 h-5 w-5" /> Report Item
            </Link>
          </Button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
             <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center animate-float">
                <Box className="h-10 w-10 text-muted-foreground" />
             </div>
             <p className="text-xl font-medium">The board is clear right now!</p>
             <p className="text-muted-foreground max-w-sm">Use the button above to post a lost or found item.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <Card key={item.id} className="glass-card overflow-hidden flex flex-col h-full group">
                <div className="relative h-56 w-full overflow-hidden">
                  <Image 
                    src={item.imageUrl || 'https://picsum.photos/seed/lost/400/300'} 
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant={item.type === 'Lost' ? 'destructive' : 'default'} className="uppercase font-bold px-3 py-1">
                      {item.type}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl font-bold">{item.title}</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-primary hover:text-primary/80 hover:bg-primary/10"
                      onClick={() => handleAIMatch(item.id)}
                      disabled={matchingId === item.id}
                    >
                      {matchingId === item.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                    </Button>
                  </div>
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <Calendar className="h-3 w-3" /> Reported {formatDistanceToNow(new Date(item.createdAt))} ago
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-6 pt-2">
                  <p className="text-sm text-foreground/70 line-clamp-2 mb-6 leading-relaxed">{item.description}</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="p-1.5 bg-white/5 rounded-lg"><MapPin className="h-4 w-4 text-primary" /></div>
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="p-1.5 bg-white/5 rounded-lg"><Phone className="h-4 w-4 text-primary" /></div>
                      <span>{item.contact}</span>
                    </div>
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
