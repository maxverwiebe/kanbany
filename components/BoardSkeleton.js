import React from "react";

export default function BoardSkeleton({
  columnsCount = 3,
  cardsPerColumn = 3,
}) {
  return (
    <main className="flex-grow">
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 overflow-x-auto px-4 py-6">
        {Array.from({ length: columnsCount }).map((_, colIdx) => (
          <div
            key={colIdx}
            className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-md flex flex-col min-w-64 max-w-160 shadow-md animate-pulse"
          >
            <div className="h-6 bg-neutral-300 dark:bg-neutral-600 rounded w-3/4 mb-4" />

            <div className="flex-1 space-y-4">
              {Array.from({ length: cardsPerColumn }).map((__, cardIdx) => (
                <div
                  key={cardIdx}
                  className="bg-white dark:bg-neutral-700 p-2 rounded shadow w-full"
                >
                  <div className="h-4 bg-neutral-300 dark:bg-neutral-600 rounded w-5/6 mb-2" />
                  <div className="h-3 bg-neutral-300 dark:bg-neutral-600 rounded w-2/3 mb-2" />
                  <div className="flex space-x-2 mt-2">
                    <div className="h-3 bg-neutral-300 dark:bg-neutral-600 rounded w-1/4" />
                    <div className="h-3 bg-neutral-300 dark:bg-neutral-600 rounded w-1/6" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex-shrink-0 w-64 p-4 rounded-lg animate-pulse bg-transparent md:opacity-0 md:group-hover:opacity-100">
          <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded w-full" />
        </div>
      </div>
    </main>
  );
}
