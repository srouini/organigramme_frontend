import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useAxios } from "./useAxios";
import { message } from "antd";

interface UsePostProps {
  onSuccess: (response: any) => void;
  endpoint: string;
  full_endpoint?: boolean;
  values?: any;
}

const usePost = ({ onSuccess, endpoint, full_endpoint=false }: UsePostProps) => {
  const api = useAxios();
  const mutation: UseMutationResult<any, AxiosError<any>, any> = useMutation({
    mutationFn: async (values: any) => {
      let url:string;
      if(full_endpoint){
        url = endpoint;
      }else{
        url = values.id ? `${endpoint}${values.id}/` : endpoint;
      }

      // Determine whether to use PUT or POST based on the presence of `values.id`
      const response: AxiosResponse = values.id && !full_endpoint
        ? await api.patch(url, values)
        : await api.post(url, values);

      return response.data;
    },
    retry: 1,
    onSuccess: (response:any) => {
      onSuccess(response);
    },
    onError: (error: AxiosError<any>) => {
      let title = "Request failed";
      let errors: Record<string, string[]> = {};

      if (error.response) {
        const { status, data } = error.response;
        const keys = Object.keys(data);
    
        // Check for 400 Bad Request errors
        if (status === 400 && keys.length > 0) {
          // Collect all error messages
          keys.forEach((key) => {
            const errorMessages = data[key];
            if (Array.isArray(errorMessages)) {
              errors[key] = errorMessages;
              errorMessages.forEach((messageText) => {
                message.error(`${key}: ${messageText}`);
              });
            } else {
              errors[key] = [errorMessages];
              message.error(`${key}: ${errorMessages}`);
            }
          });
        }
    
        // Handle 404 error
        if (status === 404) {
          title = "Page not found";
          const messageText = data.detail || "The requested resource could not be found.";
          errors["detail"] = [messageText];
          message.error(`${title}: ${messageText}`);
        }
      } else {
        // Default error handling for other cases
        errors["error"] = [error.message];
        message.error(error.message);
      }

      return errors;
    },
  });

  // Access isLoading and error from the mutation result
  const { mutate, status, error } = mutation;
  const isLoading = status === 'pending';
  const errors = error ? (error as AxiosError<any>).response?.data : null;

  return { mutate, isLoading, errors };
};

export default usePost;
