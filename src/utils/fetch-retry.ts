import { BitrefillError } from "./bitrefill-error";
import { sleep } from "./sleep";

type RetryConfig = {
  retries: number;
  factor: number;
};

export function fetchRetry(
  endpointUrl: string,
  fetchParams: RequestInit,
  retryConfig: RetryConfig = { retries: 4, factor: 2 }
): Promise<any> {
  let retries = 0;

  const fetchData = async () => {
    const response = await fetch(endpointUrl, fetchParams);

    if (response.status >= 500) {
      retries++;
      if (retries === retryConfig.retries) {
        const errorResponse = await response.json();
        throw new BitrefillError(
          errorResponse.message,
          errorResponse.error_code
        );
      }

      const delayMs = retryConfig.factor ** retries * 1000;
      console.log(`Retrying in ${delayMs / 1000} seconds...`);

      await sleep(delayMs);

      return fetchData();
    }

    return response;
  };

  return fetchData();
}
