import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={item.href || item.title} className="flex items-center">
            {item.href ? (
              <Link 
                href={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.title}
              </Link>
            ) : (
              <span className={cn(
                isLast ? "text-foreground font-medium" : ""
              )}>
                {item.title}
              </span>
            )}
            
            {!isLast && (
              <ChevronRight className="h-4 w-4 mx-1" />
            )}
          </div>
        );
      })}
    </nav>
  );
} 