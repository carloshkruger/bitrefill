import { BitrefillError } from "./bitrefill-error";
import { sleep } from "./sleep";

type RetryConfig = {
  retries: number;
  factor: number;
};

type FetchRetryConfig = {
  timeout: number;
  shouldWaitOnRateLimit?: boolean;
  retryConfig?: RetryConfig;
};

export async function fetchRetry(
  endpointUrl: string,
  fetchParams: RequestInit,
  config: FetchRetryConfig
): Promise<any> {
  const {
    timeout,
    shouldWaitOnRateLimit = false,
    retryConfig = { retries: 4, factor: 2 }
  } = config;
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

    if (
      response.status >= 500 ||
      (shouldWaitOnRateLimit && response.status === 429)
    ) {
      retries++;
      if (retries === retryConfig.retries) {
        const errorResponse = await response.json();
        throw new BitrefillError(
          errorResponse.message,
          errorResponse.error_code
        );
      }

      let delayMs = retryConfig.factor ** retries * 1000;

      if (response.status === 429) {
        const retryAfterSeconds = Number(
          response.headers.get("retry-after") ?? 0
        );
        if (retryAfterSeconds) {
          delayMs = retryAfterSeconds * 1000;
        }
      }

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
