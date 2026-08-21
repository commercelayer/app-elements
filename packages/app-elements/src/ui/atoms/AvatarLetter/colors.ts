import { asUniqueArray } from "#utils/array"

/**
 * The backgrounds an avatar picks from, deterministically, by the text it renders.
 *
 * The initials are always white, so a background's contrast against white decides
 * whether they can be read. Most of these clear 4.5:1; three pastels are kept
 * deliberately for variety and sit well below it — `#FFCC80` (1.5:1), `#9CB1FF`
 * (2.1:1), `#BBBEBE` (1.9:1) — where the initials read as a watermark rather than
 * as text.
 *
 * `getWhiteContrastRatio` measures it, if a new colour needs checking.
 */
export const BG_COLORS = asUniqueArray([
  "#FFCC80",
  "#9CB1FF",
  "#BBBEBE",
  "#343535",
  "#686E6E",
  "#11784C",
  "#0E8451",
  "#087F96",
  "#3963FF",
  "#322AD8",
  "#6B21A8",
  "#A00148",
  "#E20265",
  "#BC0007",
  "#942E0C",
  "#A96500",
  "#827500",
])

/**
 * The contrast ratio between a colour and white, from `1:1` (invisible) to `21:1`.
 *
 * @see https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 */
export function getWhiteContrastRatio(backgroundColor: string): number {
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => ({
    r: Number.parseInt(hex.slice(1, 3), 16),
    g: Number.parseInt(hex.slice(3, 5), 16),
    b: Number.parseInt(hex.slice(5, 7), 16),
  })

  /**
   * Relative luminance.
   * @see https://www.w3.org/TR/WCAG20/#relativeluminancedef
   */
  const relativeLuminance = ({
    r,
    g,
    b,
  }: {
    r: number
    g: number
    b: number
  }): number => {
    const sRGB = (c: number): number => {
      const sc = c / 255
      return sc <= 0.03928 ? sc / 12.92 : ((sc + 0.055) / 1.055) ** 2.4
    }

    return 0.2126 * sRGB(r) + 0.7152 * sRGB(g) + 0.0722 * sRGB(b)
  }

  // white's own luminance is 1, so the ratio is `(1 + 0.05) / (L + 0.05)`
  return 1.05 / (relativeLuminance(hexToRgb(backgroundColor)) + 0.05)
}
