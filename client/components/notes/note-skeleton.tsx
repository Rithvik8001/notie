import { Skeleton } from "@/components/ui/skeleton";

export function NoteSkeleton() {
  return (
    <div className="border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
      <div className="px-4 py-3 border-t border-gray-100">
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export function NotesListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <NoteSkeleton key={i} />
      ))}
    </div>
  );
}
