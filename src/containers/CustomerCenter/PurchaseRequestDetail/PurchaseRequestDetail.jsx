import { useGetPurchaseRequestDetailQuery } from "@/services/gshopApi";
import React from "react";
import { useParams } from "react-router-dom";
import PageLoading from "@/components/PageLoading";
import PageError from "@/components/PageError";

const PurchaseRequestDetail = () => {
  const { id } = useParams();
  const {
    data: purchaseRequestData,
    isLoading: isRequestLoading,
    isError: isRequestError,
  } = useGetPurchaseRequestDetailQuery(id);

  if (isRequestLoading) {
    return <PageLoading />;
  }

  if (isRequestError) {
    return <PageError />;
  }

  return <div>PurchaseRequestDetail {id}</div>;
};

export default PurchaseRequestDetail;
