export type Query = {
  type: "boolean";
  defaultValue?: boolean;
} | {
  type: "string";
  defaultValue?: string;
} | {
  type: "selector";
  options: { label?: string; value: string }[];
  defaultOption?: string;
}


export const query = (name: string, query: Query, label: string, skip = []) => {
    return { effectType: "QUERY", name, query, label, skip };
}