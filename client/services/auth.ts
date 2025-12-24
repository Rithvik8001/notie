interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

const getServerUrl = (): string => {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  if (!serverUrl) {
    throw new Error("server url is not defined");
  }
  return serverUrl;
};

const handleApiError = async (response: Response): Promise<never> => {
  let errorMessage = "An error occurred";
  let errorData: ApiErrorResponse | null = null;

  try {
    errorData = (await response.json()) as ApiErrorResponse;
    errorMessage = errorData.message || errorMessage;
  } catch {
    errorMessage =
      response.statusText || `Request failed with status ${response.status}`;
  }

  const error = new Error(errorMessage);
  (
    error as Error & {
      statusCode?: number;
      errors?: ApiErrorResponse["errors"];
    }
  ).statusCode = errorData?.statusCode || response.status;
  (error as Error & { errors?: ApiErrorResponse["errors"] }).errors =
    errorData?.errors;
  throw error;
};

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${getServerUrl()}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = (await response.json()) as ApiResponse<{
      id: string;
      email: string;
    }>;

    if (!data.success) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    if (error instanceof Error && "statusCode" in error) {
      throw error;
    }
    console.error("Login error:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to login. Please try again later."
    );
  }
};

export const signup = async (
  email: string,
  password: string,
  userName?: string
) => {
  try {
    const response = await fetch(`${getServerUrl()}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        ...(userName && { userName }),
      }),
      credentials: "include",
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = (await response.json()) as ApiResponse<{
      id: string;
      email: string;
      userName: string | null;
    }>;

    if (!data.success) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    if (error instanceof Error && "statusCode" in error) {
      throw error;
    }
    console.error("Signup error:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to sign up. Please try again later."
    );
  }
};

export const logout = async () => {
  try {
    const response = await fetch(`${getServerUrl()}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = (await response.json()) as ApiResponse<null>;

    if (!data.success) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    if (error instanceof Error && "statusCode" in error) {
      throw error;
    }
    console.error("Logout error:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to logout. Please try again later."
    );
  }
};
