import { useAxios } from "./useAxios";
import { useQuery } from "@tanstack/react-query";
import useLoading from "./useLoading";

type useDataProps = {
  name: string;
  params: any;
  endpoint: any;
  refetchInterval?: number;
  enabled?: boolean;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
};

const useData = ({ 
  params, 
  name, 
  endpoint, 
  refetchInterval, 
  enabled = true,
  staleTime = 0, // Default to 0 for real-time apps
  refetchOnWindowFocus = true,
  refetchOnMount = true
}: useDataProps) => {
  const api = useAxios();

  const { refetch, data, isLoading:isLoadingData, isRefetching, isFetching } = useQuery({
    queryKey: [name, params],
    queryFn: () => {
      try {
        const queryParams = { ...params };
        
        return api.get(endpoint, {
          params: queryParams
        });
      } catch (error) {
        console.log(error);
        throw error; // Make sure errors propagate correctly
      }
    },
    staleTime, // Time in ms that data remains fresh
    refetchOnWindowFocus, // Refetch when window regains focus
    refetchOnMount, // Refetch when component mounts
    ...(refetchInterval ? { refetchInterval } : {}),
    enabled:enabled,
    
  });

  const { isLoading:isLoading } = useLoading({
    loadingStates: [isLoadingData, isRefetching, isFetching],
  });


  return { refetch, data, isLoading, isRefetching, isFetching };
};

export default useData;