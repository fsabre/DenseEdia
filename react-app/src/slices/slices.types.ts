type LoadedState = "no" | "loading" | "yes";
interface EdiumSummary {
  id: number,
  name: string,
  kind: string,
};

export type { EdiumSummary, LoadedState };