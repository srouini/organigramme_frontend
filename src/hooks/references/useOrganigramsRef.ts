import { useEffect, useState } from "react";
import useData from "../useData";
import {  API_ORGANIGRAMMES_ENDPOINT } from "@/api/api";
import { Organigram } from "@/types/reference";

interface UseOrganigramsResult {
  results: Organigram[] | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  fetch: () => void;
  refetch: () => void;
}

const useOrganigramsRef = (): UseOrganigramsResult => {
    const [results, setResults] = useState<Organigram[]>();

    const { data, isLoading, isRefetching, refetch } = useData({
      endpoint: API_ORGANIGRAMMES_ENDPOINT,
      name: "GET_ORGANIGRAMS",
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

export default useOrganigramsRef;
