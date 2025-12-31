// Admin Typography Utility Components
// This file provides consistent typography components for admin pages

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export const AdminPageTitle = ({ children, className }: { children: ReactNode; className?: string }) => (
  <h1 className={cn("admin-heading-1", className)}>{children}</h1>
);

export const AdminPageDescription = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={cn("admin-description", className)}>{children}</p>
);

export const AdminSectionTitle = ({ children, className }: { children: ReactNode; className?: string }) => (
  <h2 className={cn("admin-heading-2", className)}>{children}</h2>
);

export const AdminCardTitle = ({ children, className }: { children: ReactNode; className?: string }) => (
  <h3 className={cn("admin-heading-3", className)}>{children}</h3>
);

export const AdminStatValue = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("admin-stat-value", className)}>{children}</div>
);

export const AdminStatLabel = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("admin-stat-label", className)}>{children}</div>
);

export const AdminBodyText = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={cn("admin-body", className)}>{children}</p>
);

export const AdminBodySmall = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={cn("admin-body-small", className)}>{children}</p>
);

