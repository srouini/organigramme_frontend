import axios, { AxiosInstance } from "axios";
import { API_ENDPOINT } from "@/utils/constants";
import { getCsrfToken } from "@/utils/csrf";

export const useAxios = (): AxiosInstance => {
  // Create an axios instance
  const axiosInstance = axios.create({
    baseURL: API_ENDPOINT,
    withCredentials: true,
    headers: {
      "X-CSRFToken": getCsrfToken(),
    },
  });

  return axiosInstance;
};
