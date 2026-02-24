/**
 * Trust live-appointment checklist room labels.
 * Backend returns only { id, completed, completedAtISO }; frontend merges with these labels.
 * @see docs/TRUST_BACKEND_INTEGRATION.md (or backend trustAdapter.ts)
 */
export const TRUST_CHECKLIST_ROOM_LABELS: Record<string, string> = {
  c1: 'Kitchen',
  c2: 'Bathrooms',
  c3: 'Floors',
};

export type ChecklistItemFromAPI = {
  id: string;
  completed: boolean;
  completedAtISO?: string;
  label?: string;
};

export type ChecklistItemWithLabel = {
  id: string;
  label: string;
  completed: boolean;
  completedAtISO?: string;
};

/**
 * Merge API checklist items with frontend labels. Use when backend returns no label.
 */
export function mergeChecklistWithLabels(
  items: ChecklistItemFromAPI[],
  labels: Record<string, string> = TRUST_CHECKLIST_ROOM_LABELS
): ChecklistItemWithLabel[] {
  return items.map((item) => ({
    ...item,
    label: item.label ?? labels[item.id] ?? item.id,
  }));
}
