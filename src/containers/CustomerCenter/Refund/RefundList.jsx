import React from "react";
import PageError from "@/components/PageError";
import PageLoading from "@/components/PageLoading";
import { useSearchParams } from "react-router-dom";
import { useURLSync } from "@/hooks/useURLSync";
import { useGetRefundListQuery } from "@/services/gshopApi";
import { PaginationBar } from "@/utils/Pagination";

import RefundCard from "@/components/RefundCard";
import RefundFilters from "./RefundFilters";


const RefundList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useURLSync(searchParams, setSearchParams, "page", "number", 1);
  const [size] = useURLSync(searchParams, setSearchParams, "size", "number", 10);
  const [sort, setSort] = useURLSync(searchParams, setSearchParams, "sort", "string", "createdAt,desc");
  const [status, setStatus] = useURLSync(searchParams, setSearchParams, "status", "string", "ALL");

  const { data, isLoading, isError } = useGetRefundListQuery({
    page: page - 1,
    size,
    sort,
    ...(status !== "ALL" && { status }),
  });

  if (isLoading) return <PageLoading />;
  if (isError) return <PageError />;

  const rows = data?.content || [];
  const totalPages = data?.totalPages || 1;
  
  const handleClearFilters = () => {
    setStatus("ALL");
    setSort("createdAt,desc");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-3 py-6 space-y-4">
        <div className="space-y-4">
          <RefundFilters
            status={status}
            setStatus={setStatus}
            sort={sort}
            setSort={setSort}
            onClear={handleClearFilters}
          />
          {rows.length === 0 ? (
            <div className="rounded-xl border p-6 text-center text-muted-foreground">
              Không có dữ liệu
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {rows.map((r) => (
                <RefundCard key={r.id} refund={r} />
              ))}
            </div>
          )}
          <div className="flex justify-center">
            <PaginationBar totalPages={totalPages} page={page} setPage={setPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundList;
