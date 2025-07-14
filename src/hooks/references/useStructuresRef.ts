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

interface UseStructuresOptions {
  unconnectedOnly?: boolean;
}

const useStructuresRef = (options?: UseStructuresOptions): UseStructuresResult => {
    const [results, setResults] = useState<Structure[]>();
    const { unconnectedOnly = false } = options || {};

    const { data, isLoading, isRefetching, refetch } = useData({
      endpoint: API_STRUCTURES_ENDPOINT,
      name: `GET_STRUCTURES_${unconnectedOnly ? 'UNCONNECTED' : 'ALL'}`,
      enabled: false,
      params: { 
        all: true,
        fields: "id,name,parent",
        ...(unconnectedOnly && { parent__isnull: true,initial_node:false })
      },
    });

    console.log(data)

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
