import { useEffect, useState } from "react";
import useData from "../useData";
import { API_POSITIONS_ENDPOINT } from "@/api/api";
import { Position } from "@/types/reference";

interface UsePositionsResult {
  results: Position[] | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  fetch: () => void;
  refetch: () => void;
}

const usePositions = (): UsePositionsResult => {
    const [results, setResults] = useState<Position[]>();

    const { data, isLoading, isRefetching, refetch } = useData({
      endpoint: API_POSITIONS_ENDPOINT,
      name: "GET_POSITIONS",
      enabled: false,
      params: { all: true },
    });

    const fetch = () => {
      if (!results) {
        refetch();
      }
    };

    useEffect(() => {
      setResults(data?.data);
    }, [data]);

    return { 
      results, 
      isLoading, 
      isRefetching, 
      fetch, 
      refetch 
    };
};

export default usePositions;
