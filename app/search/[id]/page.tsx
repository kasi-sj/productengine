"use client";
import { getProduct, getProductExtension } from "@/action/product";
import { useConfigurationStore } from "@/utils/store";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Page = ({ params }: any) => {
  const Configuration = useConfigurationStore((state) => state.configuration);

  const { data, isLoading, isFetched, error, refetch, isFetching } = useQuery({
    queryKey: ["getProduct"],
    queryFn: async () => {
      const { data } = await getProduct(Configuration, params.id);
      return data;
    },
  });

  
  const { data:extensionData, isLoading:extensionIsLoading, isFetched:extensionIsFetched, error:extensionError, refetch:extensionRefetch, isFetching:extensionIsFetching } = useQuery({
    queryKey: ["getProduct"],
    queryFn: async () => {
      return await getProductExtension(Configuration, params.id);
    },
  });


  if (error) {
    return <div>Error</div>;
  }

  if(isLoading||extensionIsLoading){
    return <div>Loading</div>
  }
  return <div>
    {JSON.stringify(data)}
    <h1>
      extension
    </h1>
    {JSON.stringify(extensionData)}
    </div>;
};

export default Page;
