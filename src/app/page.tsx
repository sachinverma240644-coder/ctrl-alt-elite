
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, ShieldCheck, Building2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-12 text-center">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="bg-primary p-2 rounded-xl">
              <Building2 className="text-primary-foreground h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-primary">DormDeck</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The next-generation hostel management system. Simplified tickets, AI-powered triaging, and a community lost-and-found hub.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="hover:border-primary transition-all group overflow-hidden border-2">
            <CardHeader className="space-y-1">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                <GraduationCap className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Student Portal</CardTitle>
              <CardDescription>
                Raise complaints, track your room issues, and browse the community board.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/student">
                <Button className="w-full h-12 text-lg" variant="default">
                  Enter Student Panel
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:border-accent transition-all group overflow-hidden border-2">
            <CardHeader className="space-y-1">
              <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent transition-colors">
                <ShieldCheck className="h-6 w-6 text-accent group-hover:text-accent-foreground" />
              </div>
              <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
              <CardDescription>
                Manage all student complaints with AI-assisted priority sorting and metrics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin">
                <Button className="w-full h-12 text-lg bg-accent hover:bg-accent/90">
                  Enter Admin Panel
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <p className="text-sm text-muted-foreground">
          Built for modern university living. Professional, organized, and efficient.
        </p>
      </div>
    </div>
  );
}
