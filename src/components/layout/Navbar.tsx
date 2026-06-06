
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Home, PlusCircle, Search, Settings, User, Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Navbar({ role }: { role: 'student' | 'admin' }) {
  const pathname = usePathname();

  const studentLinks = [
    { name: 'Dashboard', href: '/student', icon: Home },
    { name: 'New Ticket', href: '/student/new-ticket', icon: PlusCircle },
    { name: 'Lost & Found', href: '/student/lost-and-found', icon: Box },
  ];

  const adminLinks = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Complaints', href: '/admin/tickets', icon: Settings },
  ];

  const links = role === 'student' ? studentLinks : adminLinks;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block text-xl text-primary font-headline">DormDeck</span>
        </Link>
        <div className="flex flex-1 items-center space-x-4 md:justify-end">
          <div className="flex items-center space-x-2">
            {links.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                asChild
                className={cn(
                  "h-9 px-4 py-2 text-sm font-medium transition-colors",
                  pathname === link.href ? "bg-secondary text-primary" : "text-muted-foreground hover:text-primary"
                )}
              >
                <Link href={link.href}>
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.name}
                </Link>
              </Button>
            ))}
          </div>
          <div className="flex items-center space-x-2 border-l pl-4 ml-4">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="text-xs font-semibold capitalize hidden md:block">{role}</span>
             </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
