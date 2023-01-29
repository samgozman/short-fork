import type { TagThemes } from "@/components/enums/TagThemes.enum";

export interface ITagElement {
  key: string;
  value: string | number;
  title: string;
  description: string;
  /** Values: 'gray', 'red', 'green', 'yellow' */
  theme: TagThemes;
}
