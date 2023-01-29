export enum TagThemes {
  Gray = "gray",
  Red = "red",
  Green = "green",
  Yellow = "yellow",
}

export interface TagElement {
  key: string;
  value: string;
  title: string;
  description: string;
  /** Values: 'gray', 'red', 'green', 'yellow' */
  theme: TagThemes;
}
