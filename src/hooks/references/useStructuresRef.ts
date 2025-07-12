import { useEffect, useState } from "react";
import useData from "../useData";
import { API_STRUCTURES_ENDPOINT } from "@/api/api";
import { Structure } from "@/types/reference";

interface UseStructuresResult {
  results: Structure[] | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  fetch: () => void;
  refetch: () => void;
}

const useStructuresRef = (): UseStructuresResult => {
    const [results, setResults] = useState<Structure[]>();

    const { data, isLoading, isRefetching, refetch } = useData({
      endpoint: API_STRUCTURES_ENDPOINT,
      name: "GET_STRUCTURES",
      enabled: false,
      params: { all: true,fields:"id,name" },
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

export default useStructuresRef;
