import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetAllOrdersQuery } from "@/services/gshopApi";
import { useURLSync } from "@/hooks/useURLSync";
import PageLoading from "@/components/PageLoading";
import PageError from "@/components/PageError";
import OrderCard from "@/components/OrderCard";
import { PaginationBar } from "@/utils/Pagination";
import OrderFilters from "./OrderFilters";
import OrderEmptyState from "@/components/OrderEmptyState";
import { toast } from "sonner";

export default function Orders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useURLSync(searchParams, setSearchParams, "status", "string", "");
  const [sort, setSort] = useURLSync(searchParams, setSearchParams, "sort", "string", "createdAt,desc");
  const [page, setPage] = useURLSync(searchParams, setSearchParams, "page", "number", 1);
  const [size, setSize] = useURLSync(searchParams, setSearchParams, "size", "number", 10);
  const [cancellingId, setCancellingId] = useState(null);

  // Fetch orders
  const {
    data: ordersData,
    isLoading,
    isError,
    refetch,
  } = useGetAllOrdersQuery({
    page: page - 1,
    size,
    sort,
    ...(status !== "ALL" && { status }),
  });

  const allOrders = ordersData?.content || [];

  // Cancel order handler
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCancellingId(orderId);
    try {
      // You should implement a cancelOrder mutation in your API service for a real app
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to cancel order");
      toast.success("Order cancelled successfully");
      refetch();
    } catch (err) {
      toast.error(err.message || "Error cancelling order");
    } finally {
      setCancellingId(null);
    }
  };

  // Clear filters handler
  const handleClearFilters = () => {
    setStatus("");
    setSort("createdAt,desc");
  };

  if (isLoading) return <PageLoading />;
  if (isError) return <PageError />;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-3 py-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Đơn hàng của bạn</h1>
            <p className="text-gray-600">Xem và quản lý tất cả đơn hàng của bạn</p>
          </div>
        </div>
        <OrderFilters
          status={status}
          setStatus={setStatus}
          sort={sort}
          setSort={setSort}
          onClear={handleClearFilters}
        />
        <div className="space-y-4">
          {allOrders.length === 0 ? (
            <OrderEmptyState />
          ) : (
            <div className="flex flex-col gap-4">
              {allOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onCancel={handleCancelOrder}
                  cancelling={cancellingId === order.id}
                />
              ))}
            </div>
          )}
          <PaginationBar
            totalPages={ordersData?.totalPages}
            page={page}
            setPage={setPage}
          />
        </div>
      </div>
    </div>
  );
}
