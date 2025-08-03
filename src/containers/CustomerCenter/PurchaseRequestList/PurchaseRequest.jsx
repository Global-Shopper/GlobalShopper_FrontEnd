import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, ShoppingCart } from "lucide-react";
import RequestCard from "@/components/RequestCard";
import RequestFilters from "./RequestFilters";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetPurchaseRequestQuery } from "@/services/gshopApi";
import { useURLSync } from "@/hooks/useURLSync";
import { PaginationBar } from "@/utils/Pagination";
import PageError from "@/components/PageError";
import PageLoading from "@/components/PageLoading";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";

export default function PurchaseRequest() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("row");
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useURLSync(
    searchParams,
    setSearchParams,
    "page",
    "number",
    1
  );

  const [size, setSize] = useURLSync(
    searchParams,
    setSearchParams,
    "size",
    "number",
    10
  );

  // Update size when viewMode changes
  useEffect(() => {
    const newSize = viewMode === "column" ? 3 : 10;
    if (size !== newSize) {
      setSize(newSize);
    }
  }, [viewMode, setSize, size]);

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    type: "all",
    dateRange: "all",
  });

  // Sort states
  const [sort, setSort] = useState({
    field: "createdAt",
    direction: "desc",
  });

  const {
    data: purchaseRequestsData,
    isLoading: isRequestLoading,
    isError: isRequestError,
  } = useGetPurchaseRequestQuery({
    page: page - 1,
    size: size,
    type: filters.type === "all" ? "" : filters.type,
  });

  const allRequests = purchaseRequestsData?.content || [];

  const filteredRequests = allRequests.filter((request) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        request.id?.toString().includes(searchLower) ||
        request.requestItems?.some((item) =>
          item.productName?.toLowerCase().includes(searchLower)
        ) ||
        request.shippingAddress?.name?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    if (filters.status !== "all" && request.status !== filters.status) {
      return false;
    }
    if (filters.type !== "all" && request.requestType !== filters.type) {
      return false;
    }
    if (filters.dateRange !== "all") {
      const requestDate = new Date(parseInt(request.createdAt));
      const now = new Date();

      switch (filters.dateRange) {
        case "today": {
          if (requestDate.toDateString() !== now.toDateString()) return false;
          break;
        }
        case "week": {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (requestDate < weekAgo) return false;
          break;
        }
        case "month": {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (requestDate < monthAgo) return false;
          break;
        }
      }
    }

    return true;
  });

  // Client-side sorting
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    let aValue, bValue;

    switch (sort.field) {
      case "createdAt":
      case "updatedAt":
        aValue = new Date(parseInt(a[sort.field]));
        bValue = new Date(parseInt(b[sort.field]));
        break;
      case "totalProducts":
        aValue = a.requestItems?.length || 0;
        bValue = b.requestItems?.length || 0;
        break;
      case "status":
        aValue = a.status || "";
        bValue = b.status || "";
        break;
      default:
        aValue = a[sort.field] || "";
        bValue = b[sort.field] || "";
    }

    if (sort.direction === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const requests = sortedRequests;

  const handleCreateRequest = () => {
    navigate("/create-request");
  };

  if (isRequestLoading) {
    return <PageLoading />;
  }

  if (isRequestError) {
    return <PageError />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-3 py-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Yêu cầu mua hàng
            </h1>
            <p className="text-gray-600">
              Theo dõi tất cả yêu cầu mua hàng của bạn
            </p>
          </div>
          <Button
            onClick={handleCreateRequest}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-12 px-6 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Tạo yêu cầu mới
          </Button>
        </div>

        <RequestFilters
          filters={filters}
          onFiltersChange={setFilters}
          sort={sort}
          onSortChange={setSort}
        />

        <div className="space-y-4">
          {/* Switch for view mode */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium text-gray-700">
              Chế độ danh sách
            </span>
            <Switch
              checked={viewMode === "column"}
              onCheckedChange={(checked) =>
                setViewMode(checked ? "column" : "row")
              }
              id="view-mode-switch"
            />
            <span className="text-sm font-medium text-gray-700">
              Chế độ cột
            </span>
          </div>
          {requests.length === 0 ? (
            <>
              <Card className="shadow-sm">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingCart className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-3">
                    Không có yêu cầu nào
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Bạn chưa có yêu cầu mua hàng nào. Hãy tạo yêu cầu đầu tiên
                    để bắt đầu!
                  </p>
                </CardContent>
              </Card>
              <PaginationBar
                totalPages={purchaseRequestsData?.totalPages}
                page={page}
                setPage={setPage}
              />
            </>
          ) : (
            <>
              {viewMode === "row" ? (
                <div className="flex flex-col gap-4">
                  {requests.map((request) => (
                    <Link
                      to={`/account-center/purchase-request/${request.id}`}
                      key={request.id}
                    >
                      <RequestCard request={request} listView={true} />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {requests.map((request) => (
                    <Link
                      to={`/account-center/purchase-request/${request.id}`}
                      key={request.id}
                    >
                      <RequestCard request={request} />
                    </Link>
                  ))}
                </div>
              )}
              <PaginationBar
                totalPages={purchaseRequestsData?.totalPages}
                page={page}
                setPage={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}