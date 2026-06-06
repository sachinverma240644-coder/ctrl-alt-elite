'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { store, HostelRoom } from '@/app/lib/store';
import { Search, MapPin, DollarSign, Home, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { findHostelMatches } from '@/app/lib/actions';
import { useToast } from '@/hooks/use-toast';

export default function FindHostelPage() {
  const [rooms, setRooms] = useState<HostelRoom[]>([]);
  const [search, setSearch] = useState('');
  const [requirements, setRequirements] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [matches, setMatches] = useState<{roomId: string, matchScore: number, reasoning: string}[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setRooms(store.getHostelRooms());
  }, []);

  const filteredRooms = rooms.filter(r => 
    r.block.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase()) ||
    r.price.toString().includes(search) ||
    r.size.toLowerCase().includes(search.toLowerCase())
  );

  const handleAIMatch = async () => {
    if (!requirements.trim()) {
      toast({ title: "Input Required", description: "Please tell us what you're looking for." });
      return;
    }
    setIsMatching(true);
    try {
      const results = await findHostelMatches(requirements);
      setMatches(results);
      toast({ title: "AI Matches Found!", description: "We found the best rooms based on your requirements." });
    } catch (e) {
      toast({ variant: "destructive", title: "AI Error", description: "Failed to process requirements." });
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-28">
      <Navbar role="student" />
      <main className="container mx-auto px-6 mb-32">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Find Your Perfect Home</h1>
          <p className="text-muted-foreground text-lg">Search by details or let AI match your specific needs.</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* AI Matcher Section */}
          <div className="lg:col-span-1">
            <Card className="glass-card border-primary/20 sticky top-28">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" /> AI Matchmaker
                </CardTitle>
                <CardDescription>Describe your ideal room (e.g. "near gym, quiet, single occupancy")</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea 
                  placeholder="Tell us what matters to you..."
                  className="min-h-[120px]"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                />
                <Button className="w-full" onClick={handleAIMatch} disabled={isMatching}>
                  {isMatching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                  Match Me with AI
                </Button>
              </CardContent>
            </Card>
            
            {matches.length > 0 && (
               <div className="mt-8 space-y-4">
                 <h3 className="font-bold flex items-center gap-2 px-2"><Sparkles className="h-4 w-4 text-primary" /> Best AI Picks</h3>
                 {matches.map((m) => {
                   const room = rooms.find(r => r.id === m.roomId);
                   if (!room) return null;
                   return (
                     <Card key={m.roomId} className="bg-primary/5 border-primary/20">
                       <CardHeader className="p-4">
                         <div className="flex justify-between items-start mb-2">
                            <CardTitle className="text-sm font-bold">{room.block} - Room {room.roomNumber}</CardTitle>
                            <Badge className="text-[10px]">{Math.round(m.matchScore * 100)}% Match</Badge>
                         </div>
                         <CardDescription className="text-xs text-foreground/80 italic line-clamp-3">
                           "{m.reasoning}"
                         </CardDescription>
                       </CardHeader>
                     </Card>
                   );
                 })}
               </div>
            )}
          </div>

          {/* Search & Listing Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by price, block, size (Single/Double)..." 
                className="pl-10 h-12"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {filteredRooms.map((room) => (
                <Card key={room.id} className="glass-card overflow-hidden group">
                   <div className="h-40 bg-muted/20 relative overflow-hidden">
                      <img 
                        src={`https://picsum.photos/seed/${room.id}/600/400`} 
                        alt="Room" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <Badge className="absolute top-2 right-2 bg-background/80 backdrop-blur-md text-foreground">${room.price}/mo</Badge>
                   </div>
                   <CardHeader>
                      <CardTitle className="text-lg">{room.block} - Room {room.roomNumber}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                         <Badge variant="secondary">{room.size}</Badge>
                         {room.amenities.slice(0, 2).map(a => (
                           <span key={a} className="text-[10px] text-muted-foreground">• {a}</span>
                         ))}
                      </CardDescription>
                   </CardHeader>
                   <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{room.description}</p>
                   </CardContent>
                   <CardFooter>
                      <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                   </CardFooter>
                </Card>
              ))}
            </div>
            {filteredRooms.length === 0 && (
              <div className="text-center py-20 bg-muted/10 rounded-3xl border-2 border-dashed">
                <Home className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No rooms found</p>
                <p className="text-muted-foreground">Try adjusting your search filters.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}