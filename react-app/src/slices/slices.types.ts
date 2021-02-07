interface Element {
  id: number;
  kind: number;
  edium: number;
  name: string;
  value: any;
  creationDate: string;
}

interface Edium {
  id: number;
  name: string;
  kind: string;
  creationDate: string;
  elements: Element[];
}

interface EdiumSummary {
  id: number;
  name: string;
  kind: string;
};

type LoadedState = "no" | "loading" | "yes";

export type { Element, Edium, EdiumSummary, LoadedState };