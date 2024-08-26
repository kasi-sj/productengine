"use client";
import React, { use, useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getColumn, getProduct } from "@/action/product";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import { useConfigurationStore } from "@/utils/store";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import {
  Pagination,
  PaginationItem,
  PaginationCursor,
} from "@nextui-org/pagination";
import { advancedSearch, searchProduct } from "@/action/product";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

const Page = () => {
  const Configuration = useConfigurationStore((state) => state.configuration);
  const [type, setType] = useState("");
  const [product, setProduct] = useState<any>(null);
  const [fields, setFields] = useState<string[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<any[]>([]);
  const [endPage, setEndPage] = useState(0);
  const [formData, setFormData] = useState(
    fields.reduce((acc: any, field: any) => ({ ...acc, [field]: null }), {})
  );
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [sortByColumns, setSortByColumns] = useState<any[]>([]);

  useEffect(() => {
    const fetchFields = async () => {
      const columns = await getColumn(Configuration);
      setFields(columns.map((column: any) => column.Label));
      setColumns(columns);
      setSelectedColumns(columns);
    };
    fetchFields();
  }, [Configuration]);

  const fieldsPerPage = 8;
  const shouldSplit = fields.length > fieldsPerPage;
  const paginatedFields = fields.slice(
    (currentPage - 1) * fieldsPerPage,
    currentPage * fieldsPerPage
  );

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectionChange = (keys: any) => {
    const selected = columns.filter((column) => keys.has(column.key));
    setSelectedColumns(selected);
  };

  const handleSortByChange = (keys: any) => {
    const selected = columns.filter((column) => keys.has(column.key));
    setSortByColumns(selected);
  };

  // {this is for form}
  const handleNext = () => setCurrentPage(currentPage + 1);
  const handlePrevious = () => setCurrentPage(currentPage - 1);

  const { data, isLoading, isFetched, refetch, isFetching } = useQuery({
    queryKey: ["advancedSearch"],
    queryFn: async () => {
      const { data, totalRows } = await advancedSearch(
        currentTablePage * 10 - 10, //startRow
        currentTablePage * 10, //endRow
        Configuration,
        Object.entries(formData).reduce((acc: any, [key, value]) => {
          if (value !== null) {
            acc[key] = value;
          }
          return acc;
        }, {},
        ),
        sortByColumns.map((col) => col.key)
      );
      setProduct(data);
      setFormData({});
      setCurrentPage(1);
      setEndPage(Math.floor(totalRows / 10));
      return data;
    },
    enabled: false,
  });

  const {
    data: Searchdata,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
    refetch: searchRefetch,
  } = useQuery({
    queryKey: ["search"],
    queryFn: async () => {
      const { data, totalRows } = await searchProduct(
        Configuration,
        currentTablePage * 10 - 10, //startRow
        currentTablePage * 10, //endRow
        searchValue,
        sortByColumns.map((col) => col.key)
      );
      setProduct(data);
      setEndPage(Math.floor(totalRows / 10));
      return data;
    },
  });

  useEffect(() => {
    if (type === "advancedSearch") {
      refetch();
      console.log("adv refetch");
    } else {
      searchRefetch();
      console.log("search refetch");
    }
  }, [type, currentTablePage , sortByColumns]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setType("advancedSearch");
    if (currentTablePage == 1) {
      refetch();
    }
    setCurrentTablePage(1);
  };

  const handleSearch = () => {
    setType("search");
    if (currentTablePage == 1) {
      searchRefetch();
    }
    setCurrentTablePage(1);
  };

  console.log(selectedRows);

  return (
    <div className="p-6 flex flex-col gap-4 justify-center px-8 items-center">
      <Separator className="w-[1400px] ml-8 -mt-2 mb-4" />

      <div className="flex gap-4">
        {/* This is for search form */}
        <div className="flex flex-row">
          <Input
            type="text"
            className="w-96"
            placeholder="search"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
          />
          <Button className="ml-2 bg-green-500" onClick={handleSearch}>
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
        </div>
        {/* This is for advanced Search form and dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="solid"
              disabled={fields.length == 0}
              className="bg-blue-600 text-white"
            >
              Advanced Search
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] h-[600px]">
            <DialogHeader>
              <DialogTitle>Advanced Search</DialogTitle>
              <DialogDescription>
                Use the form below to perform an advanced search.
              </DialogDescription>
            </DialogHeader>
            <form
              id="dynamic-form"
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {paginatedFields.map((field: any, index: any) => (
                <div
                  key={field}
                  className={index % 3 === 2 ? "col-span-2" : "col-span-1"}
                >
                  <Label
                    htmlFor={field.toLowerCase()}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {field}
                  </Label>
                  <Input
                    id={field.toLowerCase()}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div className="col-span-2 flex justify-between mt-4">
                {shouldSplit && currentPage > 1 && (
                  <Button
                    type="button"
                    onClick={handlePrevious}
                    className="bg-green-500 text-white"
                  >
                    Previous
                  </Button>
                )}
                {shouldSplit &&
                currentPage < Math.ceil(fields.length / fieldsPerPage) ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="ml-auto bg-green-500 text-white"
                  >
                    Next
                  </Button>
                ) : (
                  <DialogFooter className="flex w-full justify-end">
                    <DialogClose
                      type="submit"
                      form="dynamic-form"
                      className="bg-green-500 text-white p-2 rounded-md"
                    >
                      Perform Search
                    </DialogClose>
                  </DialogFooter>
                )}
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* This is for the visible columns of the table */}
        <Dropdown className="text-black">
          <DropdownTrigger>
            <Button
              endContent={<ChevronDownIcon className="text-small" />}
              variant="flat"
              className="w-[185px] bg-green-500 text-white"
            >
              Visible Columns
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            closeOnSelect={false}
            selectedKeys={new Set(selectedColumns.map((col) => col.key))}
            selectionMode="multiple"
            onSelectionChange={handleSelectionChange}
            className="h-[300px] overflow-y-auto no-scrollbar"
          >
            {product?.length > 0
              ? columns.map((column) => (
                  <DropdownItem key={column.key} value={column.key}>
                    {column.Label}
                  </DropdownItem>
                ))
              : []}
          </DropdownMenu>
        </Dropdown>
        {/* This is for the visible columns of the table */}
        <Dropdown className="text-black">
          <DropdownTrigger>
            <Button
              endContent={<ChevronDownIcon className="text-small" />}
              variant="flat"
              className="w-fit p-2 px-4 bg-blue-500 text-white"
            >
              Sort By
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            closeOnSelect={false}
            selectedKeys={new Set(sortByColumns.map((col) => col.key))}
            selectionMode="multiple"
            onSelectionChange={handleSortByChange}
            className="h-[300px] overflow-y-auto no-scrollbar"
          >
            {product?.length > 0
              ? columns.map((column) => (
                  <DropdownItem key={column.key} value={column.key}>
                    {column.Label}
                  </DropdownItem>
                ))
              : []}
          </DropdownMenu>
        </Dropdown>

        {selectedRows.length > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 text-white">Compare</Button>
            </DialogTrigger>
            <DialogContent className="w-[900px]">
              <DialogHeader>
                <DialogTitle>Compare</DialogTitle>
                <DialogDescription>
                  Compare the selected products
                </DialogDescription>
              </DialogHeader>
              <DialogDescription>
                <CompareProduct selectedProducts={selectedRows} />
              </DialogDescription>
              <DialogFooter>
                <Button
                  className="bg-green-500 text-white"
                  onClick={() => setSelectedRows([])}
                >
                  Clear
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      {/* This is for the table */}
      {isLoading || isFetching || isSearchFetching || isSearchLoading ? (
        <div className="flex justify-center items-center">Loading...</div>
      ) : (
        <div className="w-[1000px]">
          {product?.length > 0 && selectedColumns?.length > 0 ? (
            <Table
              className="text-black w-full h-[500px]"
              selectionMode="multiple"
              color="default"
              onSelectionChange={(selected: any) =>
                setSelectedRows((prev) => [...prev, selected])
              }
            >
              <TableHeader columns={selectedColumns}>
                {(column) => (
                  <TableColumn key={column.key}>{column.Label}</TableColumn>
                )}
              </TableHeader>
              <TableBody items={product}>
                {(item: any) => (
                  <TableRow
                    className=" cursor-pointer"
                    key={item.sku || ""}
                    onClick={() => {
                      router.push(`search/${encodeURIComponent(item["sku"])}`);
                    }}
                  >
                    {selectedColumns.map((column) => (
                      <TableCell key={column.key}>
                        {item[column.key] ? item[column.key] : "null"}
                      </TableCell>
                    ))}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <div className="flex justify-center h-[400px] items-center text-2xl">
              {isLoading || isSearchLoading || isSearchFetching
                ? "Loading..."
                : "No data found"}
            </div>
          )}
        </div>
      )}
      {/* This is for the pagination */}
      {product?.length > 0 && (
        <Pagination
          initialPage={1}
          page={currentTablePage}
          total={endPage}
          onChange={(page) => setCurrentTablePage(page)}
          className="mt-2 "
        />
      )}
    </div>
  );
};

const CompareProduct = ({ selectedProducts }: { selectedProducts: any[] }) => {
  const Configuration = useConfigurationStore((state) => state.configuration);
  const router = useRouter();
  const {
    data,
    isLoading: isCompareLoading,
    isFetched,
    error,
    refetch,
    isFetching: isCompareFetching,
  } = useQuery({
    queryKey: ["getProduct"],
    queryFn: async () => {
      const getDetails = async (sku: string) => {
        const { data } = await getProduct(Configuration, sku);
        console.log(data);
        return data;
      };
      const data = await Promise.all(
        selectedProducts.map((product) => getDetails(product.anchorKey))
      );

      return data;
    },
  });

  if (isCompareLoading || isCompareFetching) {
    return <div>Loading...</div>;
  }

  const uniqueAttributes = Array.from(
    new Set(data?.flatMap((product) => Object.keys(product)))
  );

  if (!data) {
    return <div>No data found</div>;
  }

  return (
    <div>
      {" "}
      <Table
        className="text-black w-[800px] mt-2 ml-4 h-[400px]"
        selectionMode="none"
        color="default"
      >
        <TableHeader>
          {uniqueAttributes.map((element: any) => {
            return <TableColumn key={element}>{element}</TableColumn>;
          })}
        </TableHeader>
        <TableBody items={data}>
          {(item: any) => (
            <TableRow
              className=" cursor-pointer"
              key={item.sku || ""}
              onClick={() => {
                router.push(`search/${encodeURIComponent(item["sku"])}`);
              }}
            >
              {uniqueAttributes.map((column) => (
                <TableCell key={column}>
                  {item[column] ? item[column] : "null"}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
