const API_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalNotes: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetNotesResponse {
  notes: Note[];
  pagination: PaginationInfo;
}

interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

async function handleResponse<T>(response: Response): Promise<T> {
  const data: ApiResponse<T> = await response.json();

  if (!data.success) {
    const error = new Error(data.message) as Error & {
      errors?: Array<{ field: string; message: string }>;
      status?: number;
    };

    if (data.errors) {
      error.errors = data.errors;
    }

    error.status = response.status;
    throw error;
  }

  return data.data;
}

export async function createNote(
  title: string,
  content: string
): Promise<Note> {
  const response = await fetch(`${API_URL}/api/notes/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ title, content }),
  });

  return handleResponse<Note>(response);
}

export async function getNotes(
  page: number = 1,
  limit: number = 10
): Promise<GetNotesResponse> {
  const response = await fetch(
    `${API_URL}/api/notes/get?page=${page}&limit=${limit}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  return handleResponse<GetNotesResponse>(response);
}

export async function updateNote(
  id: string,
  data: { title?: string; content?: string }
): Promise<Note> {
  const response = await fetch(`${API_URL}/api/notes/edit/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return handleResponse<Note>(response);
}

export async function deleteNote(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/notes/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ id }),
  });

  await handleResponse<void>(response);
}
