import { MovieCardSkeleton } from "@/components/MovieCardSkeleton";

interface MovieGridSkeletonProps {
  count?: number;
}

export function MovieGridSkeleton({ count = 10 }: MovieGridSkeletonProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  );
}