import { Link, useSearchParams } from "react-router-dom";
import { Plus, ShoppingCart } from "lucide-react";
import PurchaseRequestCard from "@/components/PurchaseRequestCard";
import PurchaseRequestFilters from "./PurchaseRequestFilters";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetPurchaseRequestQuery } from "@/services/gshopApi";
import { useURLSync } from "@/hooks/useURLSync";
import { PaginationBar } from "@/utils/Pagination";
import PageError from "@/components/PageError";
import PageLoading from "@/components/PageLoading";
import { useNavigate } from "react-router-dom";

export default function PurchaseRequest() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [status, setStatus] = useURLSync(
    searchParams,
    setSearchParams,
    "status",
    "string",
    ""
  );
  const [sort, setSort] = useURLSync(
    searchParams,
    setSearchParams,
    "sort",
    "array",
    ["createdAt,desc", "expiredAt,desc"]
  );
  const [page, setPage] = useURLSync(
    searchParams,
    setSearchParams,
    "page",
    "number",
    1
  );

  const [size] = useURLSync(
    searchParams,
    setSearchParams,
    "size",
    "number",
    10
  );

  const {
    data: purchaseRequestsData,
    isLoading: isRequestLoading,
    isError: isRequestError,
  } = useGetPurchaseRequestQuery({
    page: page - 1,
    size: size,
    sort: sort,
    ...(status !== "" && status !== "all" ? { status } : {}),
  });

  const allRequests = purchaseRequestsData?.content || [];

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
        <PurchaseRequestFilters
          status={status}
          setStatus={setStatus}
          sort={sort}
          setSort={setSort}
        />

        <div className="space-y-4">
          {allRequests.length === 0 ? (
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
              <div className="flex flex-col gap-4">
                {allRequests.map((request) => (
                  <Link
                    to={`/account-center/purchase-request/${request.id}`}
                    key={request.id}
                  >
                    <PurchaseRequestCard request={request} listView={true} />
                  </Link>
                ))}
              </div>
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