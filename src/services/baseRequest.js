import axios from "axios";
import axiosRetry from "axios-retry";
import { setOnLineStatus } from "../features/app";
import { signout } from "@/features/user";

// Axios instance setup
const url = import.meta.env.VITE_GSHOP_API;

export const axiosInstance = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
  responseType: "json",
  timeout: 300000,
  timeoutErrorMessage: "Connection is timeout exceeded",
});

export const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, data, params }) => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
      });
      return { data: result.data };
    } catch (axiosError) {
      let err = axiosError.response?.data || axiosError;
      return {
        error: {
          status: axiosError.response?.status || 500,
          data: err,
        },
      };
    }
  };

// Set up interceptors
const setUpInterceptor = (store) => {
  // Retry logic
  axiosRetry(axiosInstance, {
    retries: 0,
    retryDelay: (retryCount) => retryCount * 500,
    shouldResetTimeout: true,
    retryCondition: (error) => {
      if (!navigator.onLine) {
        store.dispatch(setOnLineStatus(false));
        return false;
      }

      const status = Number(error?.response?.status);
      if (status === 503) {
        return false;
      }

      return (
        (status >= 100 && status <= 199) ||
        (status >= 500 && status <= 599) ||
        axiosRetry.isNetworkOrIdempotentRequestError(error) ||
        status === 429 ||
        status === 408 ||
        status === 400
      );
    },
  });
  // Request interceptor
  axiosInstance.interceptors.request.use(
    async (config) => {
      const appState = await store.getState();
      const accessToken = appState?.rootReducer?.user?.accessToken;
      const refreshToken = appState?.rootReducer?.user?.refreshToken;

      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }

      if (isTokenExpired(accessToken)) {
        const newAccessToken = await refreshAccessToken(refreshToken);
        if (newAccessToken) {
          config.headers["Authorization"] = `Bearer ${newAccessToken}`;
        }
      }

      if (config.data) {
				const haveFile = Object.values(config.data).some((e) => e && e.toString() === '[object File]');
				if (haveFile) {
					config.headers['Content-Type'] = 'multipart/form-data';
				}
			}

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async error => {
      console.log(error);
      if (error?.status === 401 || error.response?.data?.statusCode === 401) {
        try {
          store.dispatch(signout());
        } catch (error) {
          return Promise.reject({ ...error })
        }
      }

      return Promise.reject(error);
    }
  );
};

// Function to check if the token is expired
const isTokenExpired = (token) => {
  // Implement your logic to check token expiration
  // Return true if expired, false otherwise
};

// Function to refresh the access token
const refreshAccessToken = async (refreshToken) => {
  // Implement your logic to refresh the access token using the refresh token
  // Return the new access token
};

export default setUpInterceptor;
