import { PriceDocument } from "../__mocks__/price.generated";
import * as GQL from "../gqlRequest";
import { useReactMutation, useReactQuery } from "../useReactQuery";
import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const flushPromises = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 0));

describe("useReactQuery", () => {
  it("should return query", async () => {
    jest
      .spyOn(GQL, "gqlRequest")
      .mockImplementation(() => Promise.resolve({ price: 130.5 }));
    const Mock = ({ children }: any) => (
      <QueryClientProvider client={new QueryClient()}>
        {children}
      </QueryClientProvider>
    );
    const { result } = renderHook(() => useReactQuery(PriceDocument), {
      wrapper: Mock,
    });
    await flushPromises();
    expect(result.current.data).toEqual({ price: 130.5 });
  });

  it("should return mutation", async () => {
    jest
      .spyOn(GQL, "gqlRequest")
      .mockImplementation(() => Promise.resolve({ price: 130.5 }));
    const Mock = ({ children }: any) => (
      <QueryClientProvider client={new QueryClient()}>
        {children}
      </QueryClientProvider>
    );
    const { result } = renderHook(() => useReactMutation(PriceDocument), {
      wrapper: Mock,
    });
    result.current.mutate({ from: "111", to: "222", airBnb: "" });
    await flushPromises();
    expect(result.current.data).toEqual({ price: 130.5 });
  });
});
