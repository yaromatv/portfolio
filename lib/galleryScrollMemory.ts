const scrollLeftByProjectId = new Map<string, number>();

export function hasRememberedScrollLeft(projectId: string): boolean {
  return scrollLeftByProjectId.has(projectId);
}

export function getRememberedScrollLeft(projectId: string): number {
  return scrollLeftByProjectId.get(projectId) ?? 0;
}

export function setRememberedScrollLeft(projectId: string, scrollLeft: number): void {
  scrollLeftByProjectId.set(projectId, scrollLeft);
}

// Pierwszy projekt na liście wylicza tę wartość tak, by jego 1. zdjęcie było wyśrodkowane.
// Kolejne projekty (bez zapamiętanej pozycji) używają tej samej wartości, dzięki czemu ich
// 1. zdjęcia wyrównują się lewą krawędzią do 1. zdjęcia pierwszego projektu.
let sharedInitialScrollLeft: number | null = null;

export function getSharedInitialScrollLeft(): number | null {
  return sharedInitialScrollLeft;
}

export function setSharedInitialScrollLeft(value: number): void {
  if (sharedInitialScrollLeft === null) sharedInitialScrollLeft = value;
}
