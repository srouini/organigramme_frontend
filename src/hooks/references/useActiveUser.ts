import { useEffect, useState } from "react";
import useData from "../useData";
import { User } from "@/types/reference";
import { API_USERS_ENDPOINT } from "@/api/api";

interface UseUserResult {
  results: any;
  isLoading: boolean;
  isRefetching: boolean;
  fetch: () => void;
  refetch: () => void;
}

const useUser = (): UseUserResult => {
    const [results, setResults] = useState<User[]>();

    const { data, isLoading, isRefetching, refetch } = useData({
      endpoint: API_USERS_ENDPOINT,
      name: "GET_USER",
      enabled: false,
      params: { all: true, fields: "id,first_name,last_name,full_name" },
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

export default useUser;
