'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Home, PlusCircle, CreditCard, Box, User, Search, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Navbar({ role }: { role: 'student' | 'admin' }) {
  const pathname = usePathname();

  const studentLinks = [
    { name: 'Dashboard', href: '/student', icon: Home },
    { name: 'Find Room', href: '/student/find-hostel', icon: Search },
    { name: 'Complaints', href: '/student/new-ticket', icon: PlusCircle },
    { name: 'Rent', href: '/student/rent', icon: CreditCard },
    { name: 'Lost', href: '/student/lost-and-found', icon: Box },
  ];

  const adminLinks = [
    { name: 'Home', href: '/admin', icon: Home },
    { name: 'Tickets', href: '/admin/tickets', icon: LayoutGrid },
    { name: 'Post Room', href: '/admin/rooms/new', icon: PlusCircle },
    { name: 'Rent', href: '/admin/rent', icon: CreditCard },
  ];

  const links = role === 'student' ? studentLinks : adminLinks;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-b from-background to-transparent z-40 pointer-events-none">
        <div className="container mx-auto h-full flex items-center justify-between px-6">
          <Link href="/" className="flex items-center space-x-2 pointer-events-auto">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl text-primary tracking-tight">CampusOS.AI</span>
          </Link>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-white/10 pointer-events-auto">
            <User className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center">
        <div className="flex h-16 liquid-glass rounded-full px-4 items-center gap-1 min-w-[340px] md:min-w-[600px] border border-white/20 shadow-2xl overflow-hidden">
          <div className="flex-1 flex items-center justify-around md:justify-center gap-2">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "rounded-xl md:rounded-full px-3 md:px-5 h-11 transition-all duration-300 relative group flex flex-col md:flex-row items-center",
                    pathname === link.href 
                      ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)]" 
                      : "text-muted-foreground hover:bg-white/10 hover:text-white"
                  )}
                >
                  <link.icon className={cn("h-5 w-5 md:h-4 md:w-4 md:mr-2", pathname === link.href ? "animate-pulse" : "")} />
                  <span className="text-[9px] md:text-xs font-bold uppercase tracking-tighter md:tracking-normal">{link.name}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
