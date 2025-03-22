import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MovieCardSkeleton() {
  return (
    <Card className="w-full max-w-xs overflow-hidden">
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <Skeleton className="h-full w-full" />
        <div className="absolute top-2 right-2">
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      </div>
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent className="pb-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full mt-2" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-full rounded-md" />
      </CardFooter>
    </Card>
  );
}