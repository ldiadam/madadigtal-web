import { cache } from "react";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export class MissingStrapiConfigurationError extends Error {
  constructor() {
    super("Strapi environment variables are not configured");
    this.name = "MissingStrapiConfigurationError";
  }
}

export class StrapiRequestError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "StrapiRequestError";
  }
}

type StrapiEntity<TAttributes> = {
  id: number;
  attributes: TAttributes;
};

type StrapiListResponse<TAttributes> = {
  data?: Array<StrapiEntity<TAttributes>>;
};

type FetchCollectionOptions = {
  sort?: string[];
  pageSize?: number;
  revalidateSeconds?: number;
  searchParams?: Record<string, string | number | boolean | undefined>;
};

type StrapiConfig = {
  baseUrl: string;
  apiToken?: string;
};

const resolveStrapiConfig = cache(async (): Promise<StrapiConfig> => {
  let baseUrl = process.env.STRAPI_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL ?? null;
  let apiToken = process.env.STRAPI_API_TOKEN ?? process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ?? null;

  try {
    const context = await getCloudflareContext({ async: true });
    const cloudflareEnv = context.env as Record<string, string | undefined> | undefined;
    if (cloudflareEnv) {
      baseUrl = cloudflareEnv.STRAPI_URL ?? cloudflareEnv.STRAPI_API_URL ?? baseUrl;
      apiToken = cloudflareEnv.STRAPI_API_TOKEN ?? apiToken;
    }
  } catch (error) {
    // `getCloudflareContext` throws when running outside the Workers runtime (e.g. next dev).
    // In that case we fall back to environment variables injected via process.env.
    if (error instanceof Error && error.name !== "MissingConfigError") {
      console.debug("Ignoring Cloudflare context error while resolving Strapi config", error);
    }
  }

  if (!baseUrl) {
    throw new MissingStrapiConfigurationError();
  }

  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");

  return {
    baseUrl: normalizedBaseUrl,
    apiToken: apiToken ?? undefined,
  };
});

export async function fetchStrapiCollection<TAttributes, TResult>(
  collection: string,
  mapper: (entity: StrapiEntity<TAttributes>) => TResult | null,
  options: FetchCollectionOptions = {}
): Promise<TResult[]> {
  const { baseUrl, apiToken } = await resolveStrapiConfig();
  const requestUrl = new URL(`/api/${collection}`, baseUrl);

  const pageSize = options.pageSize ?? 100;
  requestUrl.searchParams.set("pagination[pageSize]", String(pageSize));

  for (const sort of options.sort ?? []) {
    requestUrl.searchParams.append("sort", sort);
  }

  if (options.searchParams) {
    for (const [key, value] of Object.entries(options.searchParams)) {
      if (value === undefined || value === null) {
        continue;
      }
      requestUrl.searchParams.set(key, String(value));
    }
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (apiToken) {
    headers.Authorization = `Bearer ${apiToken}`;
  }

  let response: Response;
  try {
    response = await fetch(requestUrl.toString(), {
      headers,
      next: {
        revalidate: options.revalidateSeconds ?? 300,
      },
    });
  } catch (error) {
    throw new StrapiRequestError(
      `Failed to reach Strapi at ${requestUrl.toString()}: ${(error as Error).message}`,
      0
    );
  }

  if (!response.ok) {
    const errorBody = await safelyReadBody(response);
    throw new StrapiRequestError(
      `Strapi responded with ${response.status}: ${errorBody ?? response.statusText}`,
      response.status
    );
  }

  const payload = (await response.json()) as StrapiListResponse<TAttributes>;
  if (!Array.isArray(payload.data)) {
    throw new StrapiRequestError("Strapi response payload is missing a data array", response.status);
  }

  const mapped = payload.data
    .map((entity) => mapper(entity))
    .filter((value): value is TResult => value !== null);

  return mapped;
}

async function safelyReadBody(response: Response): Promise<string | null> {
  try {
    const clone = response.clone();
    const contentType = clone.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const json = await clone.json();
      return JSON.stringify(json);
    }
    return await clone.text();
  } catch (error) {
    console.debug("Failed to read Strapi error body", error);
    return null;
  }
}
