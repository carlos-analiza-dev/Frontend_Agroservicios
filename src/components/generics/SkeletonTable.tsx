import { Skeleton } from "@/components/ui/skeleton";

const TableUsersSkeleton = () => {
  return (
    <div className="w-full space-y-2">
      <div className="flex w-full">
        <Skeleton className="h-10 flex-1 mx-1" />
        <Skeleton className="h-10 flex-1 mx-1" />
        <Skeleton className="h-10 flex-1 mx-1" />
        <Skeleton className="h-10 flex-1 mx-1" />
        <Skeleton className="h-10 flex-1 mx-1" />
        <Skeleton className="h-10 flex-1 mx-1" />
        <Skeleton className="h-10 flex-1 mx-1" />
        <Skeleton className="h-10 w-[180px] mx-1" />
      </div>

      {[...Array(5)].map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex w-full items-center">
          <div className="flex-1 mx-1">
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>

          <div className="flex-1 mx-1">
            <Skeleton className="h-4 w-5/6 mx-auto" />
          </div>

          <div className="flex-1 mx-1">
            <Skeleton className="h-4 w-2/3 mx-auto" />
          </div>

          <div className="flex-1 mx-1">
            <Skeleton className="h-4 w-4/5 mx-auto" />
          </div>

          <div className="flex-1 mx-1">
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>

          <div className="flex-1 mx-1">
            <Skeleton className="h-6 w-10 mx-auto rounded-full" />
          </div>

          <div className="flex-1 mx-1">
            <Skeleton className="h-6 w-10 mx-auto rounded-full" />
          </div>

          <div className="w-[180px] mx-1">
            <div className="flex justify-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableUsersSkeleton;
