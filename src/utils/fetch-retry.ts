import { BitrefillError } from "./bitrefill-error";
import { sleep } from "./sleep";

type RetryConfig = {
  retries: number;
  factor: number;
};

type FetchRetryConfig = {
  timeout: number;
  retryConfig?: RetryConfig;
};

export async function fetchRetry(
  endpointUrl: string,
  fetchParams: RequestInit,
  { timeout, retryConfig = { retries: 4, factor: 2 } }: FetchRetryConfig
): Promise<any> {
  let retries = 0;
  let timeoutId: NodeJS.Timeout | undefined = undefined;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new BitrefillError("Request timed out"));
    }, timeout);
  });

  const abortController = new AbortController();

  const fetchData = async () => {
    const response = await fetch(endpointUrl, {
      ...fetchParams,
      signal: abortController.signal
    });

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

  try {
    const response = await Promise.race([timeoutPromise, fetchData()]);
    return response;
  } catch (error) {
    abortController.abort();
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
