import React, { useState, useEffect, useMemo } from "react";
import { useGetHsCodesQuery } from '@/services/gshopApi';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import PageLoading from '@/components/PageLoading';
import PageError from '@/components/PageError';
import { PaginationBar } from '@/utils/Pagination';
import { useSearchParams } from 'react-router-dom';
import { useURLSync } from "@/hooks/useURLSync";
import { debounce } from "lodash";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export default function SystemConfig() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState("");
  const [search] = useURLSync(searchParams, setSearchParams, "search", "string", "");
  const [page, setPage] = useURLSync(searchParams, setSearchParams, "page", "number", 1);
  const [size] = useURLSync(searchParams, setSearchParams, "size", "number", 10);

  const { data: hsCodesData, isLoading, isError } = useGetHsCodesQuery({
    page: page - 1,
    size,
    ...(search && { description: search }),
  });

  const hsCodes = hsCodesData?.content || [];
  const totalPages = hsCodesData?.totalPages || 1;

  const debounceSearch = useMemo(() => debounce((e) => {
    setSearchParams((searchParams) => {
      searchParams.set("search", e.target.value);
      searchParams.set("page", 1);
      return searchParams;
    });
  }, 1000), [setSearchParams]);

  const handlePageSizeChange = (value) => {
    setSearchParams((searchParams) => {
      searchParams.set("size", value);
      searchParams.set("page", "1");
      return searchParams;
    });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    return () => {
      debounceSearch.cancel();
    };
  }, [debounceSearch]);

  if (isLoading) return <PageLoading />;
  if (isError) return <PageError />;

  return (
    <div className="w-full px-2 md:px-6 flex flex-col flex-1 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-xl shadow p-4 mb-6">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Tìm kiếm HS code hoặc mô tả"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              debounceSearch(e);
            }}
            className="w-64"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm text-gray-600 font-medium">Số dòng/trang:</label>
          <Select value={String(size)} onValueChange={handlePageSizeChange}>
            <SelectTrigger id="pageSize" className="w-24 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-lg shadow">
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)} className="rounded-lg">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md p-4">
        <Table className="w-full rounded-2xl border border-gray-200">
          <TableHeader>
            <TableRow className="bg-blue-100 rounded-t-2xl">
              <TableHead className="text-gray-700 font-semibold text-sm">HS Code</TableHead>
              <TableHead className="text-gray-700 font-semibold text-sm">Mô tả</TableHead>
              <TableHead className="text-gray-700 font-semibold text-sm">Đơn vị</TableHead>
              <TableHead className="text-gray-700 font-semibold text-sm">Danh mục sản phẩm</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hsCodes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">Không có dữ liệu HS Code</TableCell>
              </TableRow>
            ) : (
              hsCodes.map((row) => (
                <TableRow key={row.hsCode} className="hover:bg-blue-50/70 group">
                  <TableCell className="font-medium text-xs py-3">{row.hsCode}</TableCell>
                  <TableCell className="py-3 max-w-xl whitespace-normal">{row.description}</TableCell>
                  <TableCell className="py-3">{row.unit}</TableCell>
                  <TableCell className="py-3">{row.parentCode}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <PaginationBar totalPages={totalPages} page={page} setPage={handlePageChange} />
      </div>
    </div>
  );
}