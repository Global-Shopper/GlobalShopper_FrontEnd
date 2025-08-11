import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Store, Contact } from "lucide-react"
import { Formik } from "formik"
import { useCreateQuotationMutation } from "@/services/gshopApi"
import * as Yup from "yup"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  setGroupNote,
  setShippingEstimate,
  toggleExpandQuotation,
  initializeSubRequest,
  resetQuotationById,
} from "@/features/quotation"
import QuotationPreviewDialog from "./QuotationPreviewDialog"
import { getStatusColor, getStatusText } from "@/utils/statusHandler"
import RejectDialog from "@/components/RejectDialog"
import EditSubDialog from "./EditSubDialog"

export function SubRequestDetails({ subRequest, isExpanded, onToggleExpansion, requestType, requestStatus, children, requestItemsGroupByPlatform }) {
  // Remove manual dialog open state; will use DialogTrigger pattern
  const dispatch = useDispatch();
  const quotationState = useSelector(state => state.rootReducer.quotation?.subRequests?.[subRequest.id]);
  // API mutation (must be above early return)
  const [createQuotation] = useCreateQuotationMutation();

  const getDisplayTitle = () => {
    if (subRequest.contactInfo && subRequest.contactInfo.length > 0) {
      return subRequest.contactInfo[0]
    }
    return subRequest.seller
  }

  useEffect(() => {
    if (!quotationState) {
      console.log(subRequest)
      dispatch(initializeSubRequest({
        subRequestId: subRequest.id,
        quotationDetails: subRequest.requestItems.map(item => ({
          requestItemId: item.id,
          hsCodeId: "",
          region: "",
          basePrice: 0,
          serviceFee: 1,
          note: "",
          currency: "VND"
        }))
      }));
    }
    // eslint-disable-next-line
  }, [dispatch, subRequest.id]);

  if (!quotationState) return null;

  const { quotationDetails, note, shippingEstimate, expanded } = quotationState;
  const initialValues = {
    note: note || "",
    shippingEstimate: shippingEstimate || ""
  };

  const validationSchema = Yup.object({
    note: Yup.string().required("Vui lòng nhập ghi chú cho nhóm."),
    shippingEstimate: Yup.number().typeError("Phí vận chuyển phải là số.").required("Vui lòng nhập phí vận chuyển cho nhóm.")
  });

  return (
    <>
      <Card className={`border-l-4 ${subRequest.status === "QUOTED" || subRequest.status === "PAID" ? "border-l-blue-500" : "border-l-gray-500"}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => onToggleExpansion(subRequest.id)}>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-blue-600" />
                <span className="font-semibold">{getDisplayTitle()}</span>
              </div>
              {requestType === "ONLINE" && subRequest.ecommercePlatform && (
                <Badge variant="secondary" className="text-xs">
                  {subRequest.ecommercePlatform}
                </Badge>
              )}
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  subRequest.status
                )}`}
              >
                {getStatusText(subRequest.status)}
              </span>
            </div>
            <Button variant="ghost" size="sm">
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          {/* Contact Info - Only show when expanded */}
          {isExpanded && subRequest.contactInfo && subRequest.contactInfo.length > 0 && (
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Contact className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Thông tin liên hệ</span>
              </div>
              <div className="space-y-2">
                {subRequest.contactInfo.map((info, i) => (
                  <div key={i} className="text-sm bg-white px-3 py-2 rounded border border-blue-100">
                    {info.split("\n").map((line, lineIdx) => (
                      <div key={lineIdx} className={lineIdx > 0 ? "mt-1" : ""}>
                        {line}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-2">{children}</div>
          {console.log(subRequest.status)}
          {(subRequest.status === "PENDING" && (requestStatus === "CHECKING" || requestStatus === "QUOTED")) && (
            <>
              <Button
                type="button"
                variant="link"
                className="text-blue-600 font-medium mt-2"
                onClick={() => dispatch(toggleExpandQuotation({ subRequestId: subRequest.id }))}
              >
                {expanded ? "Đóng báo giá nhóm" : "Nhập thông tin và gửi báo giá đơn hàng"}
              </Button>
              <EditSubDialog subRequest={subRequest} requestItemsGroupByPlatform={requestItemsGroupByPlatform} />
              {expanded && (
                <Formik
                  enableReinitialize
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={async (values, actions) => {
                    // Build details from latest Redux state
                    const details = quotationDetails.map((detail) => ({ ...detail }));
                    const payload = {
                      subRequestId: subRequest.id,
                      note: values.note,
                      shippingEstimate: Number(values.shippingEstimate),
                      details,
                      expiredDate: 1
                    };
                    try {
                      await createQuotation(payload).unwrap()
                        .then(() => {
                          dispatch(resetQuotationById({ subRequestId: subRequest.id }));
                          toast.success("Gửi báo giá thành công!")
                        })
                    } catch (err) {
                      toast.error("Gửi báo giá thất bại!" + (err?.data?.message ? `: ${err.data.message}` : ""));
                    }
                    actions.setSubmitting(false);
                  }}
                >
                  {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                      <div>
                        <label className="block font-medium mb-1">Ghi chú cho đơn hàng</label>
                        <Textarea
                          name="note"
                          placeholder="Nhập ghi chú cho nhóm này (nếu có)..."
                          value={values.note}
                          onChange={e => {
                            handleChange(e);
                            dispatch(setGroupNote({ subRequestId: subRequest.id, note: e.target.value }));
                          }}
                          onBlur={handleBlur}
                        />
                        {touched.note && errors.note && (
                          <div className="text-red-500 text-xs">{errors.note}</div>
                        )}
                      </div>

                      <div>
                        <label className="block font-medium mb-1">Ước tính phí vận chuyển cho đơn hàng</label>
                        <Input
                          name="shippingEstimate"
                          type="number"
                          placeholder="Nhập phí vận chuyển"
                          value={values.shippingEstimate}
                          onChange={e => {
                            handleChange(e);
                            dispatch(setShippingEstimate({ subRequestId: subRequest.id, shippingEstimate: e.target.value }));
                          }}
                          onBlur={handleBlur}
                        />
                        {touched.shippingEstimate && errors.shippingEstimate && (
                          <div className="text-red-500 text-xs">{errors.shippingEstimate}</div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-4">
                        {subRequest.status !== "REJECTED" && (
                          <>
                            <Button type="submit" name="submit" disabled={isSubmitting}>Gửi báo giá</Button>
                            <QuotationPreviewDialog subRequest={subRequest} values={values} quotationDetails={quotationDetails} handleSubmit={handleSubmit} />
                            <RejectDialog subRequestId={subRequest.id} />
                          </>
                        )}
                      </div>
                    </form>
                  )}
                </Formik>
              )}
            </>
          )
          }
        </CardContent>
      </Card>
    </>
  )
}
