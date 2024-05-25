
export type FieldMeta = {
  id: string;
  hidden?: string;
  disabled?: string;
  caption?: string;
  name: string;
  typeSpec?: string;
};

export type GroupMeta = {
  id: string;
  name?: string;
  items: FieldMeta[];
};

