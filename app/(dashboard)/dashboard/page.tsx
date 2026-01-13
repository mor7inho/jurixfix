import { Suspense } from 'react';
import DashboardContent from '@/components/DashboardContent';

function DashboardLoadingFallback() {
  return (
    <div className="p-4 md:p-8 w-full">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoadingFallback />}>
      <DashboardContent />
    </Suspense>
  );
}
