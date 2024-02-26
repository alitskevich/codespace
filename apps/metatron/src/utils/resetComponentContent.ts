import { Fn, parseJson } from "ultimus";

export function resetComponentContent(body: string, componentId: string, projectId: string, resetUI: Fn) {
  const storeKey = `meta:${projectId}`;
  if (!body) return;
  const stored = window.localStorage.getItem(storeKey);
  if (stored) {
    const meta = parseJson(stored);
    const component = meta.components.find((e: any) => e.id === componentId);
    if (component && component?.body !== body) {
      component.body = body;
      window.localStorage.setItem(storeKey, JSON.stringify(meta));
      resetUI();
    }
  }
}
