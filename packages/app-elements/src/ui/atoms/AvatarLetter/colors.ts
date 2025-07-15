import { asUniqueArray } from "#utils/array"

export const BG_COLORS = asUniqueArray([
  "#BBBEBE",
  "#79E4F8",
  "#FFCC80",
  "#FFF280",
  "#83F2C2",
  "#18D0F3",
  "#9CB1FF",
  "#FFEA2E",
  "#FF8E92",
  "#1FDA8A",
  "#FFAB2E",
  "#FE84BA",
  "#BDAA00",
  "#686E6E",
  "#11784C",
  "#BC0007",
  "#942E0C",
  "#A00148",
  "#322AD8",
  "#343535",
])

export function getTextColorForBackground(
  backgroundColor: string,
): "black" | "white" {
  /**
   * Convert a hexadecimal format to RGB format.
   */
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => ({
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  })

  /**
   * Calculate the relative luminance of the color.
   * @see https://www.w3.org/TR/WCAG20/#relativeluminancedef
   */
  const calculateRelativeLuminance = ({
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

  /**
   * Calculate contrast ratios with both white and black.
   *
   * To calculate the contrast ratio,
   * the relative luminance of the lighter color (`L1`)
   * is divided through the relative luminance of the darker color (`L2`):
   * ```
   * (L1 + 0.05) / (L2 + 0.05)
   * ```
   *
   * This results in a value ranging from `1:1` (no contrast at all) to `21:1` (the highest possible contrast).
   */
  const calculateWhiteAndBlackContrastRatio = (
    luminance: number,
  ): { white: number; black: number } => {
    const whiteLuminance = calculateRelativeLuminance(hexToRgb("#FFFFFF"))
    const blackLuminance = calculateRelativeLuminance(hexToRgb("#000000"))

    return {
      white: (whiteLuminance + 0.05) / (luminance + 0.05),
      black: (luminance + 0.05) / (blackLuminance + 0.05),
    }
  }

  const rgb = hexToRgb(backgroundColor)

  const luminance = calculateRelativeLuminance(rgb)

  const { white, black } = calculateWhiteAndBlackContrastRatio(luminance)

  return white > black ? "white" : "black"
}
