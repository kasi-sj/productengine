"use client";
import { getProduct, getSimilarProducts } from "@/action/product";
import { useConfigurationStore } from "@/utils/store";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

const Page = ({ params }: any) => {
  const Configuration = useConfigurationStore((state) => state.configuration);

  const { data, isLoading, isFetched, error, refetch, isFetching } = useQuery({
    queryKey: ["getProduct"],
    queryFn: async () => {
      const { data } = await getProduct(
        Configuration,
        decodeURIComponent(params.id)
      );
      return data;
    },
  });

  const router = useRouter();
  const {
    data: similarData,
    isLoading: similarIsLoading,
    isFetched: similarIsFetched,
    error: similarError,
    refetch: similarRefetch,
    isFetching: similarIsFetching,
  } = useQuery({
    queryKey: ["getSimilarProduct"],
    queryFn: async () => {
      const { data } = await getSimilarProducts(
        Configuration,
        decodeURIComponent(params.id)
      );
      console.log(data);
      return data;
    },
  });

  if (error) {
    return <div>Error</div>;
  }

  if (isLoading) {
    return <div>Loading</div>;
  }
  return (
    <div className="flex flex-col">
      <Separator className="w-[1400px] ml-8 " />
      <ProductDetails data={data} />
      <Separator className="w-[1400px] ml-8 mt-4 " />
      <div className="text-2xl font-semibold pl-8 p-4">Similar Products</div>
      <div className="flex flex-row pl-8 overflow-x-scroll mx-4 gap-4 no-scrollbar">
        {similarData ? (
          similarData.map((product: any, idx: any) => (
            <div
              className="w-full hover:cursor-pointer"
              key={idx}
              onClick={() =>
                router.push(`/search/${encodeURIComponent(product.sku)}`)
              }
            >
              <ProductCard data={product} />
            </div>
          ))
        ) : (
          <div className="flex justify-center h-full items-center mb-4">
            {similarIsFetching ? "Loading" : "No Similar Products"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;

const ProductDetails = ({ data }: any) => {
  const [image, setImage] = React.useState("");

  // Convert the data object to an array of key-value pairs
  const dataEntries = Object.entries(data);

  // Chunk data into groups of 8
  const chunkData = (data: any, chunkSize: any) => {
    const result = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      result.push(data.slice(i, i + chunkSize));
    }
    return result;
  };

  const chunkedData = chunkData(dataEntries, 8);

  chunkedData.map((chunk) => {
    chunk.map(([key, value]: any) => {
      if (key === "Image") {
        setImage(value);
      }
    });
  });

  return (
    <div className="grid grid-cols-3 p-4 w-full gap-4 ">
      <div className="col-span-3 text-2xl font-semibold">Product Details </div>
      <div className="col-span-1 w-full  border p-4 rounded shadow-md bg-white">
        <img
          src={image ? image : "/product.jpeg"}
          alt="product"
          className="w-full h-[300px] object-contain"
        />
      </div>

      <div className="col-span-2  w-full  border p-4 rounded shadow-md bg-white">
        {chunkedData[0]?.map(([key, value]: any, idx: any) => (
          <div key={idx} className="mb-2">
            <strong>{key}</strong>: {value || "N/A"}
          </div>
        ))}
      </div>

      {/* Additional Details (2-column grid) */}
      <div className="col-span-1"></div>
      <div className="col-span-2 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {chunkedData.slice(1).map((chunk, index) => (
          <div key={index} className="border p-4 rounded shadow-md bg-white">
            {chunk.map(([key, value]: any, idx: any) => (
              <div key={idx} className="mb-2">
                <strong>{key == "image" ? "" : key + " : "}</strong>{" "}
                {key == "image" ? "" : value || "N/A"}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductCard = ({ data }: any) => {
  const main = {
    sku: data.sku,
    label: data.label,
    version: data.version,
    currency: data.currency,
  };
  return (
    <div className="flex flex-col  w-[300px] p-2 gap-4 shadow-xl mt-2 mb-4 border-2 rounded-lg ">
      <div className=" h-[150px]  bg-white">
        <img
          src={data.Image ? data.Image : "/product.jpeg"}
          alt="product"
          className="  object-cover"
        />
      </div>

      <div className=" w-full  bg-white mt-2">
        {Object.entries(main).map(([key, value], idx) => (
          <div key={idx} className="line-clamp-1">
            <strong>{key}</strong>: {value || "N/A"}
          </div>
        ))}
      </div>
    </div>
  );
};
