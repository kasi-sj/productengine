"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getColumn } from "@/action/product";
import { useConfigurationStore } from "@/utils/store";
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
import { advancedSearch } from "@/action/product";
import { config } from "process";

const Page = () => {
  const Configuration = useConfigurationStore((state) => state.configuration);
  const [product, setProduct] = useState<any>(null);
  const [fields, setFields] = useState<string[]>([]);

  const [formData, setFormData] = useState(
    fields.reduce((acc: any, field: any) => ({ ...acc, [field]: null }), {})
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchFields = async () => {
      const columns = await getColumn(Configuration);
      setFields(columns.map((column: any) => column.Label));
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

  const handleNext = () => setCurrentPage(currentPage + 1);
  const handlePrevious = () => setCurrentPage(currentPage - 1);

  const handleSubmit = () => {
    // const filter = formData.map((key: any, val: any) => {
    //   val != null ? { key: key, value: val } : null;
    // });
    // console.log("filter", filter);
    // const data = await advancedSearch(Configuration, formData);
    // setProduct(data);
    // console.log(data);
    console.log(FormData);
  };

  return (
    <div className="p-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" disabled={fields.length == 0}>
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
                <Button type="button" onClick={handlePrevious}>
                  Previous
                </Button>
              )}
              {shouldSplit &&
              currentPage < Math.ceil(fields.length / fieldsPerPage) ? (
                <Button type="button" onClick={handleNext} className="ml-auto">
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
      <div>Hi - {JSON.stringify(product)}</div>
    </div>
  );
};

export default Page;
