import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import {
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useMutation,
  useQuery,
} from "react-query";
import { GqlClientOptions, gqlRequest } from "./gqlRequest";

export const useReactQuery = <TData, TVariables, TError = unknown>(
  document: TypedDocumentNode<TData, TVariables>,
  variables?: TVariables,
  options?: UseQueryOptions<TData, any, TData> & {
    gqlOptions?: GqlClientOptions;
  }
): UseQueryResult<TData, any> =>
  useQuery<TData>(
    `${(document.definitions[0] as any)?.name?.value}${JSON.stringify(
      variables
    )}`,
    () => gqlRequest(document, variables, options?.gqlOptions),
    options
  );

export const useReactMutation = <
  TData,
  TVariables,
  TError = unknown,
  TContext = unknown
>(
  document: TypedDocumentNode<TData, TVariables>,
  options?: UseMutationOptions<TData, TError, TVariables, TContext> & {
    gqlOptions?: GqlClientOptions;
  }
): UseMutationResult<TData, TError, TVariables, TContext> => {
  return useMutation(
    (variables: TVariables) =>
      gqlRequest(document, variables, options?.gqlOptions),
    options
  );
};
