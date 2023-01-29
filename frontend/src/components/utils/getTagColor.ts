import { TagThemes } from "@/components/enums/TagThemes.enum";

interface ITagColorRange {
  best: [number, number];
  worst: [number, number];
  normal?: [number, number];
}

/**
 * Returns the color of the tag based on the value and the range
 * @param value - numeric value of the tag (allowed null & undefined)
 * @param ranges - range of the best and worst values (best: [min, max], worst: [min, max]).
 * `normal` range is optional because it can be calculated from the best and worst ranges in most cases.
 */
export const getTagColor = (
  value: number | null | undefined,
  ranges: ITagColorRange
): TagThemes => {
  if (value === null || value === undefined) {
    return TagThemes.Gray;
  }

  if (value > ranges.best[0] && value <= ranges.best[1]) {
    return TagThemes.Green;
  }

  if (ranges.normal && value > ranges.normal[0] && value <= ranges.normal[1]) {
    return TagThemes.Yellow;
  }

  // In case ranges.normal is not defined
  if (value > ranges.best[1] && value <= ranges.worst[0]) {
    return TagThemes.Yellow;
  }

  if (value > ranges.worst[0] && value <= ranges.worst[1]) {
    return TagThemes.Red;
  }

  return TagThemes.Gray;
};
