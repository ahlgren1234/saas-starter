"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function Navbar() {
  const { user, signOut } = useAuth();

  const navigationItems = [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
  ];

  const userMenuItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Profile', href: '/profile' },
    ...(user?.role === 'admin' ? [{ name: 'Admin', href: '/admin' }] : []),
    { name: 'Settings', href: '/settings/billing' },
  ];

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">SaaS Starter</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 px-8">
            <div className="flex space-x-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-4">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  ))}
                  {!user && (
                    <>
                      <Link href="/login">
                        <Button variant="ghost" size="sm" className="w-full">
                          Sign in
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button size="sm" className="w-full">
                          Get started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Image
                      src={user.avatar || '/avatars/default.png'}
                      alt="Avatar"
                      className="rounded-full object-cover"
                      fill
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user.name && <p className="font-medium">{user.name}</p>}
                      {user.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {userMenuItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href}>{item.name}</Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onClick={() => signOut()}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Get started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 