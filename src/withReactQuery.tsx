import React from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import {
  DefaultOptions,
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "react-query";
import { GqlClientOptions } from "./gqlRequest";

export type GqlQueryClientConfig = {
  queryCache?: QueryCache;
  mutationCache?: MutationCache;
  defaultOptions?: DefaultOptions;
  gqlOptions?: GqlClientOptions;
};

let globalGqlOptions: GqlClientOptions;

let queryClient: {
  client: QueryClient;
  gqlOptions: GqlClientOptions;
};

const getGqlReactQueryClient = (config: GqlQueryClientConfig) => {
  if (typeof window === "undefined" || !queryClient) {
    const { gqlOptions, ...queryClientConfig } = config;

    queryClient = {
      client: new QueryClient(queryClientConfig),
      gqlOptions: gqlOptions,
    };
  }
  return queryClient;
};

export const setGlobalGqlOptions = (gqlOptions: GqlClientOptions) => {
  globalGqlOptions = gqlOptions;
};

export const getGqlOptions = () => {
  return queryClient?.gqlOptions ?? globalGqlOptions;
};

export function withReactQuery<PageProps>(
  PageComponent: React.FC<PageProps>,
  config: GqlQueryClientConfig
) {
  const WithReactQuery: React.FC<PageProps> = (pageProps) => {
    return (
      <QueryClientProvider client={getGqlReactQueryClient(config).client}>
        <ReactQueryDevtools initialIsOpen={false} />
        <PageComponent {...pageProps} />
      </QueryClientProvider>
    );
  };
  if (process.env.NODE_ENV !== "production") {
    const displayName =
      PageComponent.displayName || PageComponent.name || "Component";
    WithReactQuery.displayName = `withReactQuery(${displayName})`;
  }
  return WithReactQuery;
}
