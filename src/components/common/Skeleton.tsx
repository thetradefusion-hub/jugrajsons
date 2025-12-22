import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  className?: string;
}

export const SkeletonProductCard: React.FC<SkeletonCardProps> = ({ className }) => {
  return (
    <div className={cn('bg-card rounded-xl overflow-hidden', className)}>
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-4 skeleton w-3/4" />
        <div className="h-3 skeleton w-1/2" />
        <div className="flex gap-2">
          <div className="h-5 skeleton w-16" />
          <div className="h-5 skeleton w-12" />
        </div>
        <div className="h-10 skeleton w-full rounded-lg" />
      </div>
    </div>
  );
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 3, 
  className 
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className={cn('h-4 skeleton', i === lines - 1 ? 'w-2/3' : 'w-full')} 
        />
      ))}
    </div>
  );
};

export const SkeletonImage: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={cn('skeleton', className)} />;
};
