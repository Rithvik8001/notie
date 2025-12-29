import { User } from "@/components/dashboard";
import { create } from "zustand";
import { getCurrentUser } from "@/services/auth";
import {
  createNote as createNoteApi,
  getNotes as getNotesApi,
  updateNote as updateNoteApi,
  deleteNote as deleteNoteApi,
  Note,
  PaginationInfo,
} from "@/services/notes";

export interface UserStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  fetchUser: (force?: boolean) => Promise<void>;
  clearUser: () => void;
}

export const userStore = create<UserStore>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  fetchUser: async (force = false) => {
    const { user } = get();

    if (user && !force) {
      return;
    }

    try {
      set({ isLoading: true, error: null });
      const response = await getCurrentUser();
      if (response.success && response.data) {
        set({ user: response.data, isLoading: false, error: null });
      } else {
        set({ error: "Failed to load user data", isLoading: false });
      }
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to load user data",
        isLoading: false,
      });
    }
  },
  clearUser: () => set({ user: null, error: null }),
}));

export interface NotesStore {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationInfo | null;
  setNotes: (notes: Note[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  fetchNotes: (page?: number, limit?: number) => Promise<void>;
  createNote: (title: string, content: string) => Promise<void>;
  updateNote: (id: string, data: { title?: string; content?: string }) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  clearNotes: () => void;
}

export const notesStore = create<NotesStore>((set, get) => ({
  notes: [],
  isLoading: false,
  error: null,
  pagination: null,
  setNotes: (notes) => set({ notes }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  fetchNotes: async (page = 1, limit = 10) => {
    try {
      set({ isLoading: true, error: null });
      const response = await getNotesApi(page, limit);
      set({
        notes: response.notes,
        pagination: response.pagination,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to load notes",
        isLoading: false,
      });
    }
  },
  createNote: async (title: string, content: string) => {
    try {
      set({ isLoading: true, error: null });
      const newNote = await createNoteApi(title, content);
      const { notes } = get();
      set({
        notes: [newNote, ...notes],
        isLoading: false,
        error: null,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to create note",
        isLoading: false,
      });
      throw err;
    }
  },
  updateNote: async (id: string, data: { title?: string; content?: string }) => {
    try {
      set({ isLoading: true, error: null });
      const updatedNote = await updateNoteApi(id, data);
      const { notes } = get();
      set({
        notes: notes.map((note) => (note.id === id ? updatedNote : note)),
        isLoading: false,
        error: null,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to update note",
        isLoading: false,
      });
      throw err;
    }
  },
  deleteNote: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await deleteNoteApi(id);
      const { notes } = get();
      set({
        notes: notes.filter((note) => note.id !== id),
        isLoading: false,
        error: null,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to delete note",
        isLoading: false,
      });
      throw err;
    }
  },
  clearNotes: () => set({ notes: [], pagination: null, error: null }),
}));
