
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Home, PlusCircle, CreditCard, Box, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Navbar({ role }: { role: 'student' | 'admin' }) {
  const pathname = usePathname();

  const studentLinks = [
    { name: 'Home', href: '/student', icon: Home },
    { name: 'Tickets', href: '/student/new-ticket', icon: PlusCircle },
    { name: 'Rent', href: '/student/rent', icon: CreditCard },
    { name: 'Lost', href: '/student/lost-and-found', icon: Box },
  ];

  const adminLinks = [
    { name: 'Home', href: '/admin', icon: Home },
    { name: 'Tickets', href: '/admin/tickets', icon: Settings },
  ];

  const links = role === 'student' ? studentLinks : adminLinks;

  return (
    <>
      {/* Top Brand Bar (Desktop & Mobile) - Kept subtle at top */}
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

      {/* Unified Bottom Navigation (Desktop & Mobile) */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center">
        {/* Desktop View */}
        <div className="hidden md:flex h-16 liquid-glass rounded-full px-4 items-center gap-1 min-w-[500px] border border-white/20 shadow-2xl">
          <div className="flex-1 flex items-center justify-center gap-2">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "rounded-full px-6 h-11 transition-all duration-300 relative group",
                    pathname === link.href 
                      ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)]" 
                      : "text-muted-foreground hover:bg-white/10 hover:text-white"
                  )}
                >
                  <link.icon className={cn("mr-2 h-4 w-4", pathname === link.href ? "animate-pulse" : "")} />
                  <span className="font-semibold">{link.name}</span>
                  {pathname === link.href && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                  )}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile View */}
        <div className="flex md:hidden h-16 liquid-glass rounded-2xl items-center justify-around px-4 min-w-[320px] border border-white/20 shadow-2xl">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="relative group">
              <div className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300 px-4 py-2 rounded-xl",
                pathname === link.href ? "text-primary scale-110" : "text-muted-foreground hover:text-white"
              )}>
                <link.icon className="h-6 w-6" />
                <span className="text-[10px] font-bold uppercase tracking-tighter">{link.name}</span>
                {pathname === link.href && (
                  <div className="absolute -bottom-0 w-1.5 h-1.5 bg-primary rounded-full blur-[1px]" />
                )}
              </div>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
