"use client";
import { getProduct } from "@/action/product";
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

  if (error) {
    return <div>Error</div>;
  }

  if(isLoading){
    return <div>Loading</div>
  }
  return <div>{JSON.stringify(data)}</div>;
};

export default Page;
