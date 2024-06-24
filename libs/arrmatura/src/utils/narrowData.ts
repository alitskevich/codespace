import { mapEntries } from "ultimus";

export const narrowData = (data: any) => {
  if (!data) {
    return [];
  }
  if (typeof data === "string") return data.split(",").map((id) => ({ id, name: id }));
  if (Array.isArray(data)) return data;
  if (typeof data[Symbol.iterator] === "function") return [...data];
  if (typeof data === "object")
    return mapEntries(data, (key, value) =>
      typeof value === "object" ? { ...value, id: key } : { id: key, name: String(value) }
    );
  return [{ id: String(data), name: String(data) }];
};
