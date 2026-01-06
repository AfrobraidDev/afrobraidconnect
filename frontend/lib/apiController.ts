import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

// Define generic request types
interface ApiControllerProps {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  data?: any;
  params?: any;
  requiresAuth?: boolean;
  token?: string | null;
}

export const apiController = async <T>({
  method,
  url,
  data = null,
  params = null,
  requiresAuth = false,
  token = null,
}: ApiControllerProps): Promise<T> => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  const isFormData = data instanceof FormData;

  const axiosInstance: AxiosInstance = axios.create({
    baseURL,
    headers: {
      Accept: "application/json",
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
  });

  if (requiresAuth) {
    if (!token) {
      return Promise.reject(
        new Error("Authentication token is missing for a protected route.")
      );
    }
    // Type-safe header assignment
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response: AxiosResponse<T> = await axiosInstance({
      method,
      url,
      data,
      params,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      console.error("API Error Status:", axiosError.response.status);
      console.error("API Error Data:", axiosError.response.data);
      throw axiosError.response.data;
    } else if (axiosError.request) {
      console.error("API No Response:", axiosError.request);
      throw new Error("No response from server. Please check your connection.");
    } else {
      console.error("API Setup Error:", axiosError.message);
      throw error;
    }
  }
};
