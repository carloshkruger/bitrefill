export function convertObjectToUrlQueryParams(data: Record<any, any>): string {
  const urlParams = new URLSearchParams();
  for (const [key, value] of Object.entries(data)) {
    urlParams.set(key, value.toString());
  }
  return urlParams.toString();
}
