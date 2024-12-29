import { Skeleton } from "@/components/ui/skeleton";

function GigSkeleton() {
    return (
        <div className="mx-auto mt-8">
            <div>
                <Skeleton className="h-8 w-3/4" />
            </div>
            <div>
                <Skeleton
                    className="h-4 w-full mb-2"
                    count={3}
                />
                <div className="h-6 w-1/4 mb-4" />
                <div className="h-10 w-32" />
            </div>
        </div>
    );
}

export default GigSkeleton