import React, { useState, useEffect, useMemo } from "react";
import { Input } from '@/components/ui/input';
import { useSearchParams } from 'react-router-dom';
import { useURLSync } from "@/hooks/useURLSync";
import { debounce } from "lodash";
import HsTree from "@/components/HsTree";
import PageLoading from '@/components/PageLoading';
import PageError from '@/components/PageError';
import { useGetHsCodesQuery } from '@/services/gshopApi';

export default function HsCodeDialogContent({ setHScode }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search] = useURLSync(searchParams, setSearchParams, "search", "string", "");
  const [hsCode] = useURLSync(searchParams, setSearchParams, "hsCode", "string", "");

  const [searchInput, setSearchInput] = useState(search || "");
  const [hsCodeInput, setHsCodeInput] = useState(hsCode || "");

  const { data: hsCodesData, isLoading, isError, isUninitialized } = useGetHsCodesQuery({
    ...(search && { description: search }),
    ...(hsCode && { hsCode }),
  });

  const debounceSearch = useMemo(
    () =>
      debounce((e) => {
        setSearchParams((sp) => {
          sp.set("search", e.target.value);
          return sp;
        });
      }, 1000),
    [setSearchParams]
  );

  const debounceHSCode = useMemo(
    () =>
      debounce((e) => {
        setSearchParams((sp) => {
          sp.set("hsCode", e.target.value);
          return sp;
        });
      }, 1000),
    [setSearchParams]
  );

  useEffect(() => {
    return () => {
      debounceSearch.cancel();
      debounceHSCode.cancel();
    };
  }, [debounceSearch, debounceHSCode]);

  return (
    <div className="w-full px-2 md:px-6 flex flex-col flex-1 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-xl shadow p-4 mb-6">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Tìm kiếm theo mô tả"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              debounceSearch(e);
            }}
            className="w-64"
          />
          <Input
            type="text"
            placeholder="Tìm kiếm theo code"
            value={hsCodeInput}
            onChange={(e) => {
              setHsCodeInput(e.target.value);
              debounceHSCode(e);
            }}
            className="w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4">
        {isError ? (
          <PageError />
        ) : isLoading || isUninitialized ? (
          <PageLoading />
        ) : !hsCodesData ? (
          <div className="text-sm text-gray-500">Không có dữ liệu.</div>
        ) : (
          <HsTree treeData={hsCodesData.content} selectedCode={hsCode} setHScode={setHScode} showSearch={false} />
        )}
      </div>
    </div>
  );
}
