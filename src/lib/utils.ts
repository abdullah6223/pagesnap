export function configToString(configAPI: URLSearchParams) {
  let result = "";
  for (const [key, value] of configAPI) {
    if (key === "url") continue;
    result += `_${key}-${value}`;
  }
  return result;
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function buildImageId(url: string, params: URLSearchParams, date: Date = new Date()): string {
  return `${isoDate(date)}.${slugify(url)}${slugify(configToString(params))}`;
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

const POSITIVE_NUMBER_REGEX = /^\d+$/;

export const isValidNum = (value?: string) => value && POSITIVE_NUMBER_REGEX.test(value);
