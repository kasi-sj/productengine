"use client";
import { getColumn, searchProduct } from "@/action/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConfigurationStore } from "@/utils/store";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDownIcon } from "lucide-react";

type Column = {
  key: string;
  Label: string;
};

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<Column[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState<string>("");
  const [endPage, setEndPage] = useState(1);
  const [fetching, setFetching] = useState(false);
  const Configuration = useConfigurationStore((state) => state.configuration);

  useEffect(() => {
    const fetchProducts = async () => {
      setProducts([]);
      const { data, totalRows } = await searchProduct(
        Configuration,
        currentPage * 10 - 10,
        currentPage * 10,
        searchValue
      );
      setProducts(data);
      setEndPage(Math.ceil(totalRows / 10));
    };

    const fetchColumns = async () => {
      console.log("hai");
      const data = await getColumn(Configuration);
      setColumns(data);
      setSelectedColumns(data);
    };
    setFetching(true);

    fetchColumns();
    fetchProducts();
    setFetching(false);
  }, [currentPage, Configuration]);

  useEffect(() => {
    if (currentPage === 1) {
      const fetchProducts = async () => {
        setFetching(true);
        setProducts([]);
        const { data, totalRows } = await searchProduct(
          Configuration,
          1 * 10 - 10,
          1 * 10,
          searchValue
        );
        setFetching(false), setProducts(data);
        setEndPage(Math.ceil(totalRows / 10));
      };
      fetchProducts();
    } else {
      setCurrentPage(1);
    }
  }, [searchValue]);

  if (Configuration === undefined || Configuration === null) {
    return (
      <>
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <div className="">configuration not found</div>
        </main>
      </>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-row">
        <Input type="text" className="w-96" placeholder="search" />
        <Button className="ml-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="white"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </Button>
        <Select>
          <SelectTrigger>
            <Button className="w-[100px] bg-white">Visible Columns</Button>
          </SelectTrigger>
          <SelectContent className="h-[300px] w-[300px] overflow-y-auto no-scrollbar">
            {columns.map((column) => (
              <Button
                variant={"outline"}
                className="w-full"
                key={column.key}
                onClick={() => {
                  if (
                    selectedColumns.map((item) => item.key).includes(column.key)
                  ) {
                    setSelectedColumns(
                      selectedColumns.filter((item) => item.key !== column.key)
                    );
                    return;
                  }
                  setSelectedColumns([...selectedColumns, column]);
                }}
              >
                {column.Label}
                <div>
                  {selectedColumns.map((item) => item.key).includes(column.key)
                    ? "✓"
                    : null}
                </div>
              </Button>
            ))}
          </SelectContent>
        </Select>
      </div>
      {JSON.stringify(products)}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => {
                setCurrentPage(currentPage - 1);
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">{currentPage}</PaginationLink>
          </PaginationItem>
          {currentPage < endPage && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => {
                setCurrentPage(currentPage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
}
