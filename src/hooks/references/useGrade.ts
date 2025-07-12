import { useEffect, useState } from "react";
import useData from "../useData";
import { API_GRADES_ENDPOINT } from "@/api/api";
import { Grade } from "@/types/reference";

interface UseGradeResult {
  results: Grade[] | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  fetch: () => void;
  refetch: () => void;
}

const useGrade = (): UseGradeResult => {
    const [results, setResults] = useState<Grade[]>();

    const { data, isLoading, isRefetching, refetch } = useData({
      endpoint: API_GRADES_ENDPOINT,
      name: "GET_GRADES",
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

export default useGrade;
