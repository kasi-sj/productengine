"use client";
import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getColumn } from "@/action/product";
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
import { advancedSearch } from "@/action/product";
import { useQuery } from "@tanstack/react-query";

const Page = () => {
  const Configuration = useConfigurationStore((state) => state.configuration);
  const [ready, setReady] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [fields, setFields] = useState<string[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<any[]>([]);
  const [endPage, setEndPage] = useState(0);
  const [formData, setFormData] = useState(
    fields.reduce((acc: any, field: any) => ({ ...acc, [field]: null }), {})
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTablePage, setCurrentTablePage] = useState(1);

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

  // {this is for form}
  const handleNext = () => setCurrentPage(currentPage + 1);
  const handlePrevious = () => setCurrentPage(currentPage - 1);

  const { data, isLoading, isFetched, refetch , isFetching} = useQuery({
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
        }, {})
      );
      setProduct(data);
      setFormData({});
      setCurrentPage(1);
      setEndPage(Math.floor(totalRows / 10));
      return data;
    },
    enabled: false,
  });

  const handleSubmit = async (e: any) => {
    setReady(true);
    e.preventDefault();
    if(currentTablePage==1){
      refetch();
    }
    setCurrentTablePage(1);
  };

  useEffect(() => {
    if (ready) refetch();
  }, [currentTablePage, ready]);

  if(isLoading||isFetching){
    return <div>Loading...</div>
  }

  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="flex gap-4">
        <Input className="w-[300px]" placeholder="Search" />
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
            {data?.length > 0
              ? columns.map((column) => (
                  <DropdownItem key={column.key} value={column.key}>
                    {column.Label}
                  </DropdownItem>
                ))
              : []}
          </DropdownMenu>
        </Dropdown>

        {/* This is for the table */}
      </div>

      <div className="w-[1000px]">
        {data?.length > 0 && selectedColumns?.length > 0 ? (
          <Table className="text-black w-full h-[400px]">
            <TableHeader columns={selectedColumns}>
              {(column) => (
                <TableColumn key={column.key}>{column.Label}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={data}>
              {(item: any) => (
                <TableRow key={item.typedId}>
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
            {isLoading ? "Loading..." : "No data found"}
          </div>
        )}
      </div>

      {/* This is for the pagination */}
      {endPage > 0 && (
        <Pagination
          initialPage={1}
          page={currentTablePage}
          total={endPage}
          onChange={(page) => setCurrentTablePage(page)}
          className="mt-5"
        />
      )}
    </div>
  );
};

export default Page;
