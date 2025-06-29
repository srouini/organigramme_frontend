import { useEffect, useState } from 'react';

interface UseLoadingProps {
  loadingStates: boolean[]; // Array of loading states
}

const useLoading = ({ loadingStates }: UseLoadingProps) => {
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Set isLoading to true if any loading state in the array is true
    setLoading(loadingStates?.some((state) => state));
  }, [loadingStates]);

  return { isLoading };
};

export default useLoading;