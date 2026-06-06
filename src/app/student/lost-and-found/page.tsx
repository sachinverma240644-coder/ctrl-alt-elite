
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { store } from '@/app/lib/store';
import { MapPin, Phone, Calendar, Plus, Box } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function LostAndFoundPage() {
  const items = store.getLostItems();

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="student" />
      <main className="container mx-auto py-8 px-4 md:px-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Lost & Found Hub</h1>
            <p className="text-muted-foreground text-lg">Help your community recover lost belongings.</p>
          </div>
          <Button asChild className="bg-accent hover:bg-accent/90">
            <Link href="/student/lost-and-found/report">
              <Plus className="mr-2 h-4 w-4" /> Report Item
            </Link>
          </Button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
             <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Box className="h-8 w-8 text-muted-foreground" />
             </div>
             <p className="text-xl font-medium">The board is clear right now!</p>
             <p className="text-muted-foreground max-w-sm">No items have been reported recently. Use the button above to post a lost or found item.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-all group">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image 
                    src={item.imageUrl || 'https://picsum.photos/seed/lost/400/300'} 
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint="lost item"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant={item.type === 'Lost' ? 'destructive' : 'default'} className="uppercase font-bold">
                      {item.type}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl line-clamp-1">{item.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <Calendar className="h-3 w-3" /> Reported {formatDistanceToNow(new Date(item.createdAt))} ago
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-4">
                  <p className="text-sm text-foreground/80 line-clamp-3 mb-4">{item.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-accent" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4 text-accent" />
                      <span>{item.contact}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/30 pt-4">
                  <Button variant="outline" className="w-full">View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
