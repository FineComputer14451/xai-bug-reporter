import { create } from "zustand";
import {
  detectSystemInfo,
  emptyDraft,
  systemFilled,
  type ReportDraft,
  type SavedDraft,
} from "@/lib/report";

const STORAGE_KEY = "incident-desk:v1";
const MAX_DRAFTS = 16;

type DeskState = {
  draft: ReportDraft;
  drafts: SavedDraft[];
  hydrated: boolean;
  setField: <K extends keyof ReportDraft>(key: K, value: ReportDraft[K]) => void;
  patchDraft: (partial: Partial<ReportDraft>) => void;
  reset: () => void;
  saveDraft: () => SavedDraft | null;
  loadDraft: (id: string) => void;
  deleteDraft: (id: string) => void;
  captureSystem: () => void;
  hydrate: () => void;
};

type Persisted = {
  draft: ReportDraft;
  drafts: SavedDraft[];
};

function readStorage(): Persisted | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Persisted;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      draft: { ...emptyDraft(), ...(parsed.draft ?? {}) },
      drafts: Array.isArray(parsed.drafts) ? parsed.drafts : [],
    };
  } catch {
    return null;
  }
}

function writeStorage(data: Persisted) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* quota / private mode */
  }
}

export const useDeskStore = create<DeskState>((set, get) => ({
  draft: emptyDraft(),
  drafts: [],
  hydrated: false,
  setField: (key, value) =>
    set((state) => ({ draft: { ...state.draft, [key]: value } })),
  patchDraft: (partial) =>
    set((state) => ({ draft: { ...state.draft, ...partial } })),
  reset: () =>
    set((state) => ({
      draft: {
        ...emptyDraft(),
        ...detectSystemInfo(),
        contactEmail: state.draft.contactEmail,
        subscription: state.draft.subscription,
      },
    })),
  saveDraft: () => {
    const { draft, drafts } = get();
    const saved: SavedDraft = {
      ...draft,
      id: crypto.randomUUID(),
      savedAt: Date.now(),
    };
    const next = [saved, ...drafts].slice(0, MAX_DRAFTS);
    set({ drafts: next });
    return saved;
  },
  loadDraft: (id) => {
    const found = get().drafts.find((item) => item.id === id);
    if (!found) return;
    const { id: _id, savedAt: _savedAt, ...rest } = found;
    set({ draft: { ...emptyDraft(), ...rest } });
  },
  deleteDraft: (id) =>
    set((state) => ({ drafts: state.drafts.filter((item) => item.id !== id) })),
  captureSystem: () =>
    set((state) => ({ draft: { ...state.draft, ...detectSystemInfo() } })),
  hydrate: () => {
    if (get().hydrated) return;
    const persisted = readStorage();
    const detected = detectSystemInfo();
    if (persisted) {
      const draft = systemFilled(persisted.draft)
        ? persisted.draft
        : { ...persisted.draft, ...detected };
      set({ draft, drafts: persisted.drafts, hydrated: true });
    } else {
      set({ draft: { ...emptyDraft(), ...detected }, hydrated: true });
    }
  },
}));

export function persistDesk() {
  const { draft, drafts, hydrated } = useDeskStore.getState();
  if (!hydrated) return;
  writeStorage({ draft, drafts });
}
