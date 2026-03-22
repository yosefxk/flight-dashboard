/**
 * Converts "ALL CAPS STRING" to "All Caps String"
 */
export function toProperCase(str: string): string {
  if (!str) return str;
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
