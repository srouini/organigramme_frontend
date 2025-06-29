import { useState } from "react";

const usePage = () => {
  const [page, setPage] = useState<number>(1);
  const pageSizeStr = localStorage.getItem("page_size");

  const setPageSize = (pageSize: number) => {
    localStorage.setItem("page_size", pageSize.toString());
  };


  const getPageSize = (): number => {
    if (pageSizeStr) {
      return parseInt(pageSizeStr);
    }
    return 10;
  };

  return { getPageSize, setPageSize, page, setPage };
};

export default usePage;
