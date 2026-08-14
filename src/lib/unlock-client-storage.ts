const VISITOR_KEY = "linklock_visitor";

export type UnlockProgressCache = {
  completedKeys: string[];
  status: string;
};

function progressKey(campaignId: string) {
  return `linklock_progress_${campaignId}`;
}

export function getStoredVisitorId() {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function actionProgressKey(action: { type: string; label: string; config: unknown }) {
  const config = action.config as Record<string, string> | null;
  const url = (config?.url || "").trim().toLowerCase();
  const label = action.label.trim().toLowerCase();
  return `${action.type}|${url}|${label}`;
}

export function readUnlockProgress(campaignId: string): UnlockProgressCache | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(progressKey(campaignId));
    if (!raw) return null;
    return JSON.parse(raw) as UnlockProgressCache;
  } catch {
    return null;
  }
}

export function writeUnlockProgress(campaignId: string, data: UnlockProgressCache) {
  if (typeof window === "undefined") return;
  localStorage.setItem(progressKey(campaignId), JSON.stringify(data));
}

export function completedIdsFromKeys<T extends { id: string; type: string; label: string; config: unknown }>(
  actions: T[],
  keys: string[]
): string[] {
  const set = new Set(keys);
  return actions.filter((a) => set.has(actionProgressKey(a))).map((a) => a.id);
}

export function mergeCompletedIds(serverIds: string[], localIds: string[]) {
  return [...new Set([...serverIds, ...localIds])];
}
