import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { GraphQLError, OperationDefinitionNode } from "graphql";
import { print } from "graphql/language/printer";
import { getGqlOptions } from "./withReactQuery";

export type GqlClientOptions = {
  endpoint: string;
  headers?: { [header: string]: string };
};

export type GqlResponse<TData> = {
  data: TData;
  errorCode?: number | null;
  errors: GraphQLError[];
};

export const getOperationName = (document: TypedDocumentNode<any, any>) => {
  return (
    (document.definitions[0] as OperationDefinitionNode)?.name?.value ?? ""
  );
};
export const getOperationType = (document: TypedDocumentNode<any, any>) => {
  return (document.definitions[0] as OperationDefinitionNode)?.operation;
};

export const createRequest = <TData, TVariables>(
  options: GqlClientOptions,
  document: TypedDocumentNode<TData, TVariables>,
  variables?: TVariables
) => {
  const operationName = getOperationName(document);

  const params: { [key: string]: string } = {
    operationName,
  };

  const url = new URL(options.endpoint);

  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );
  const postUrl = url.toString();

  if (variables) {
    url.searchParams.append("variables", JSON.stringify(variables));
  }

  const getUrl = url.toString();

  const body = {
    operationName,
    ...(variables && { variables }),
  };

  return {
    getUrl,
    postUrl,
    body,
  };
};

const handleResponse = async (res: Response) => {
  if (res.status > 400) {
    const error = await res.json();

    throw new Error(error.msg);
  }
  return res.json();
};

const postRequest = async ({
  postUrl,
  headers,
  body,
  document,
}: {
  postUrl: string;
  headers: { [key: string]: string };
  body: {
    operationName: string;
    variables?: any;
    extensions?: {
      persistedQuery: { version: number; sha256Hash: string };
    } | null;
  };
  document: TypedDocumentNode<any, any>;
}) => {
  const result = await fetch(postUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({ ...body, query: print!(document) }),
  }).then(handleResponse);
  return result;
};

export const gqlRequest = async <TData, TVariables>(
  document: TypedDocumentNode<TData, TVariables>,
  variables?: TVariables,
  options?: GqlClientOptions
): Promise<TData> => {
  if (!options) {
    options = getGqlOptions();
  }
  if (!options.endpoint) {
    throw new Error("Gql Endpoint option is mandatory");
  }
  const { body, postUrl } = createRequest(options, document, variables);
  let result: GqlResponse<TData>;

  result = await postRequest({
    postUrl,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    body,
    document,
  });

  if (result.errors?.length) {
    const rawError = result.errors[0];
    if (rawError) {
      throw rawError;
    }
  }
  return result?.data;
};
