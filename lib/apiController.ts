import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

interface ApiControllerProps {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  data?: unknown;
  params?: unknown;
  requiresAuth?: boolean;
  token?: string | null;
}

interface BackendErrorResponse {
  message?: string;
  detail?: string;
  status?: string;
  [key: string]: unknown;
  error?: string;
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
      throw new Error("Authentication token is missing for a protected route.");
    }
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
    const axiosError = error as AxiosError<BackendErrorResponse>;

    if (axiosError.response) {
      const status = axiosError.response.status;
      const errorData = axiosError.response.data;

      const rawMessage =
        errorData?.message ||
        errorData?.detail ||
        errorData?.error ||
        (typeof errorData === "string" ? errorData : null) ||
        `Request failed with status ${status}`;

      const cleanMessage = rawMessage.replace(/^(error|Error):\s*/, "");

      console.error(`API Error (${status}):`, cleanMessage);

      throw new Error(cleanMessage);
    } else if (axiosError.request) {
      console.error("API No Response:", axiosError.message);
      throw new Error(
        "No response from server. Please check your internet connection."
      );
    } else {
      console.error("API Setup Error:", axiosError.message);
      throw new Error("An unexpected client error occurred.");
    }
  }
};
