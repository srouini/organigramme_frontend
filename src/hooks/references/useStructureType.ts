import { useEffect, useState } from "react";
import useData from "../useData";
import { API_STRUCTURE_TYPE_ENDPOINT } from "@/api/api";
import { Grade, StructureType } from "@/types/reference";

interface UseStrutureTypeResult {
  results: StructureType[] | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  fetch: () => void;
  refetch: () => void;
}

const useStructureType = (): UseStrutureTypeResult => {
    const [results, setResults] = useState<StructureType[]>();

    const { data, isLoading, isRefetching, refetch } = useData({
      endpoint: API_STRUCTURE_TYPE_ENDPOINT,
      name: "GET_STRUCTURE_TYPE",
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
      console.log(data)
    }, [data]);

    return { 
      results, 
      isLoading, 
      isRefetching, 
      fetch, 
      refetch 
    };
};

export default useStructureType;
