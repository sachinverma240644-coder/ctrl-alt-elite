
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
      {/* Top Brand Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 liquid-glass z-50 flex items-center px-6 justify-between md:hidden">
        <Link href="/" className="flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl text-primary tracking-tight">CampusOS.AI</span>
        </Link>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-white/10">
          <User className="h-4 w-4 text-primary" />
        </div>
      </div>

      {/* Desktop Sidebar / Top Nav (Fallback or Modern floating) */}
      <nav className="hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 h-16 liquid-glass rounded-full px-6 items-center gap-2 z-50 min-w-[500px]">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg text-primary">CampusOS.AI</span>
        </Link>
        <div className="flex-1 flex items-center justify-center gap-1">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                className={cn(
                  "rounded-full px-4 h-10 transition-all",
                  pathname === link.href ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-white/10"
                )}
              >
                <link.icon className="mr-2 h-4 w-4" />
                {link.name}
              </Button>
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-6 left-6 right-6 h-16 liquid-glass rounded-2xl flex items-center justify-around px-2 z-50 md:hidden">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="relative group">
            <div className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300 px-3 py-1 rounded-xl",
              pathname === link.href ? "text-primary scale-110" : "text-muted-foreground hover:text-white"
            )}>
              <link.icon className="h-6 w-6" />
              <span className="text-[10px] font-medium">{link.name}</span>
              {pathname === link.href && (
                <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />
              )}
            </div>
          </Link>
        ))}
      </nav>
    </>
  );
}
