import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const items = [
  {
    title: 'Overview',
    href: '/admin',
  },
  {
    title: 'Users',
    href: '/admin/users',
  },
  {
    title: 'Waiting List',
    href: '/admin/waiting-list',
  },
  {
    title: 'Settings',
    href: '/admin/settings',
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === item.href
              ? 'text-foreground'
              : 'text-muted-foreground'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
} 