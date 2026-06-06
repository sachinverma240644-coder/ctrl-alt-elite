
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, ShieldCheck, Building2, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-float" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full" />

      <div className="max-w-4xl w-full space-y-12 text-center z-10">
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="bg-primary/20 p-3 rounded-2xl border border-primary/30 liquid-glass animate-float">
              <Building2 className="text-primary h-10 w-10" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white">CampusOS<span className="text-primary">.AI</span></h1>
          </div>
          <p className="text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Intelligent campus infrastructure. <span className="text-white font-medium">Rent tracking</span>, <span className="text-white font-medium">AI maintenance</span>, and <span className="text-white font-medium">smart communities</span>.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="glass-card hover:scale-105 transition-all group overflow-hidden border-2 rounded-3xl">
            <CardHeader className="space-y-4">
              <div className="bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-2 group-hover:bg-primary transition-all duration-500">
                <GraduationCap className="h-7 w-7 text-primary group-hover:text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Student Portal</CardTitle>
                <CardDescription className="text-base mt-2">
                  Raise AI-triaged tickets, track rent dues, and find lost items instantly.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/student">
                <Button className="w-full h-14 text-lg font-bold rounded-2xl" variant="default">
                  Enter Student Panel
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="glass-card hover:scale-105 transition-all group overflow-hidden border-2 rounded-3xl">
            <CardHeader className="space-y-4">
              <div className="bg-accent/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-2 group-hover:bg-accent transition-all duration-500">
                <ShieldCheck className="h-7 w-7 text-accent group-hover:text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Admin Dashboard</CardTitle>
                <CardDescription className="text-base mt-2">
                  Manage campus logistics with real-time analytics and predictive triaging.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/admin">
                <Button className="w-full h-14 text-lg font-bold rounded-2xl bg-accent hover:bg-accent/90">
                  Enter Admin Panel
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-center gap-2 text-muted-foreground animate-pulse">
          <Sparkles className="h-4 w-4" />
          <p className="text-sm font-medium tracking-widest uppercase">Powered by Gemini Pro Vision</p>
        </div>
      </div>
    </div>
  );
}
