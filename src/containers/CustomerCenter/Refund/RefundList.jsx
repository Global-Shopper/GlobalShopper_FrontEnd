import React from "react";
import PageError from "@/components/PageError";
import PageLoading from "@/components/PageLoading";
import { Link, useSearchParams } from "react-router-dom";
import { useURLSync } from "@/hooks/useURLSync";
import { useGetRefundListQuery } from "@/services/gshopApi";
import { PaginationBar } from "@/utils/Pagination";

// Nếu bạn dùng shadcn/ui Table:
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";

function formatVND(value) {
  if (typeof value !== "number") return "";
  try {
    return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  } catch {
    return `${value} ₫`;
  }
}

const RefundList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useURLSync(searchParams, setSearchParams, "page", "number", 1);
  const [size] = useURLSync(searchParams, setSearchParams, "size", "number", 10);
  const [sort] = useURLSync(searchParams, setSearchParams, "sort", "string", "createdAt,desc");
  const [status] = useURLSync(searchParams, setSearchParams, "status", "string", "ALL");

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

  return (
    <div className="space-y-4">
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Evidence</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rejection Reason</TableHead>
              <TableHead>Xem đơn hàng</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>#{r.id}</TableCell>
                  <TableCell>
                    {Array.isArray(r.evidence) && r.evidence.length > 0
                      ? r.evidence.join(", ")
                      : "—"}
                  </TableCell>
                  <TableCell>{r.reason || "—"}</TableCell>
                  <TableCell className="text-right">{formatVND(r.amount)}</TableCell>
                  <TableCell>{r.status || "—"}</TableCell>
                  <TableCell>{r.rejectionReason || "—"}</TableCell>
                  <TableCell><Link to={`/account-center/orders/${r.orderId}`}>Đến đơn hàng</Link></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center">
        <PaginationBar totalPages={totalPages} page={page} setPage={setPage} />
      </div>
    </div>
  );
};

export default RefundList;
