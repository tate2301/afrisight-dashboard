import { useState, useCallback } from "react";

type AsyncFunction<T> = () => Promise<T>;

const useWithStatus = () => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const executor = useCallback(
    async <T>(asyncFunction: AsyncFunction<T>): Promise<T> => {
      setLoading(true);
      setError(null);
      try {
        const result = await asyncFunction();
        return result;
      } catch (error) {
        setError(
          error instanceof Error ? error : new Error("An error occurred"),
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    executor,
    error,
    isLoading,
  };
};

export default useWithStatus;
