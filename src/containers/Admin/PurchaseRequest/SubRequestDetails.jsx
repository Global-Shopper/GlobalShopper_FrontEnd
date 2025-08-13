import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Store, Contact } from "lucide-react"
import { Formik } from "formik"
import { useCreateQuotationOnlineMutation, useCreateQuotationOfflineMutation } from "@/services/gshopApi"
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
import { PACKAGE_TYPE } from "@/const/packageType"

export function SubRequestDetails({ subRequest, isExpanded, onToggleExpansion, requestType, requestStatus, children, requestItemsGroupByPlatform }) {
  // Remove manual dialog open state; will use DialogTrigger pattern
  const dispatch = useDispatch();
  const quotationState = useSelector(state => state.rootReducer.quotation?.subRequests?.[subRequest.id]);
  // API mutation (must be above early return)
  const [createQuotationOnline] = useCreateQuotationOnlineMutation();
  const [createQuotationOffline] = useCreateQuotationOfflineMutation();

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
    shippingEstimate: shippingEstimate || "",
    // ONLINE-only
    totalPriceBeforeExchange: "",
    feesText: "",
    // OFFLINE-only
    totalWeightEstimate: "",
    packageType: PACKAGE_TYPE?.[0]?.type || "YOUR_PACKAGING",
    shipper: {
      shipmentStreetLine: "",
      shipmentCity: "",
      shipmentCountryCode: "",
      shipmentPostalCode: "",
      shipmentPhone: "",
      shipmentName: "",
    },
    recipient: {
      recipientStreetLine: "",
      recipientCity: "",
      recipientCountryCode: "",
      recipientPostalCode: "",
      recipientPhone: "",
      recipientName: "",
    },
  };

  const validationSchema = Yup.object({
    note: Yup.string().required("Vui lòng nhập ghi chú cho nhóm."),
    ...(requestType === "ONLINE"
      ? {shippingEstimate: Yup.number().typeError("Phí vận chuyển phải là số.").required("Vui lòng nhập phí vận chuyển cho nhóm.")}
      : {}),
    ...(requestType === "ONLINE"
      ? { totalPriceBeforeExchange: Yup.number().typeError("Tổng trước quy đổi phải là số.").required("Vui lòng nhập tổng trước quy đổi.") }
      : {}),
    ...(requestType === "OFFLINE"
      ? { packageType: Yup.string().required("Vui lòng chọn loại gói hàng.") }
      : {}),
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
          {((subRequest.status === "PENDING" || !subRequest.status) && (requestStatus === "CHECKING" || requestStatus === "QUOTED")) && (
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
                    const expiredDate = Date.now() + 3 * 24 * 60 * 60 * 1000; // default 3 days
                    try {
                      if (requestType === "ONLINE") {
                        const details = quotationDetails.map((d) => ({
                          requestItemId: d.requestItemId,
                          currency: d.currency,
                          basePrice: Number(d.basePrice ?? 0),
                          serviceFee: Number(d.serviceFee ?? 0),
                        }));
                        const fees = values.feesText
                          ? values.feesText.split(',').map((s) => s.trim()).filter(Boolean)
                          : [];
                        const payload = {
                          subRequestId: subRequest.id,
                          shippingEstimate: Number(values.shippingEstimate),
                          expiredDate,
                          note: values.note,
                          totalPriceBeforeExchange: Number(values.totalPriceBeforeExchange),
                          fees,
                          details,
                        };
                        await createQuotationOnline(payload).unwrap();
                      } else {
                        const details = quotationDetails.map((d) => ({
                          requestItemId: d.requestItemId,
                          hsCodeId: d.hsCodeId,
                          region: d.region,
                          basePrice: Number(d.basePrice ?? 0),
                          serviceFee: Number(d.serviceFee ?? 0),
                          note: d.note,
                          currency: d.currency,
                        }));
                        const payload = {
                          subRequestId: subRequest.id,
                          note: values.note,
                          details,
                          shippingEstimate: Number(values.shippingEstimate),
                          expiredDate,
                          totalWeightEstimate: Number(values.totalWeightEstimate || 0),
                          packageType: values.packageType,
                          shipper: { ...values.shipper },
                          recipient: { ...values.recipient },
                        };
                        await createQuotationOffline(payload).unwrap();
                      }
                      dispatch(resetQuotationById({ subRequestId: subRequest.id }));
                      toast.success("Gửi báo giá thành công!");
                    } catch (err) {
                      toast.error("Gửi báo giá thất bại!" + (err?.data?.message ? `: ${err.data.message}` : ""));
                    }
                    actions.setSubmitting(false);
                  }}
                >
                  {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                      {console.log(values)}
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



                      {requestType === "ONLINE" && (
                        <>
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
                          <div>
                            <label className="block font-medium mb-1">Tổng trước quy đổi</label>
                            <Input
                              name="totalPriceBeforeExchange"
                              type="number"
                              placeholder="Nhập tổng trước quy đổi"
                              value={values.totalPriceBeforeExchange}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {touched.totalPriceBeforeExchange && errors.totalPriceBeforeExchange && (
                              <div className="text-red-500 text-xs">{errors.totalPriceBeforeExchange}</div>
                            )}
                          </div>
                          <div>
                            <label className="block font-medium mb-1">Phí (nhập văn bản, nhiều mục cách nhau bằng dấu phẩy)</label>
                            <Input
                              name="feesText"
                              type="text"
                              placeholder="Ví dụ: phí nền tảng, phụ thu"
                              value={values.feesText}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </div>
                        </>
                      )}

                      {requestType === "OFFLINE" && (
                        <>
                          <div>
                            <label className="block font-medium mb-1">Tổng khối lượng ước tính (KG)</label>
                            <Input
                              name="totalWeightEstimate"
                              type="number"
                              placeholder="Nhập khối lượng ước tính"
                              value={values.totalWeightEstimate}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </div>
                          <div>
                            <label className="block font-medium mb-1">Loại gói hàng</label>
                            <select
                              name="packageType"
                              className="w-full px-3 py-2 border rounded"
                              value={values.packageType}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                              {PACKAGE_TYPE.map((p) => {
                                if (p.weightMax < values.totalWeightEstimate) {
                                  return null;
                                }
                                return (
                                  <option key={p.type} value={p.type}>{p.value}</option>
                                )
                              })}
                            </select>
                            {touched.packageType && errors.packageType && (
                              <div className="text-red-500 text-xs">{errors.packageType}</div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="font-semibold mb-2">Thông tin người gửi</div>
                              <Input name="shipper.shipmentName" placeholder="Tên người gửi" value={values.shipper.shipmentName} onChange={handleChange} onBlur={handleBlur} className="mb-2" />
                              <Input name="shipper.shipmentPhone" placeholder="Số điện thoại người gửi" value={values.shipper.shipmentPhone} onChange={handleChange} onBlur={handleBlur} className="mb-2" />
                              <Input name="shipper.shipmentStreetLine" placeholder="Địa chỉ" value={values.shipper.shipmentStreetLine} onChange={handleChange} onBlur={handleBlur} className="mb-2" />
                              <Input name="shipper.shipmentCity" placeholder="Thành phố" value={values.shipper.shipmentCity} onChange={handleChange} onBlur={handleBlur} className="mb-2" />
                              <Input name="shipper.shipmentCountryCode" placeholder="Mã quốc gia (VD: US)" value={values.shipper.shipmentCountryCode} onChange={handleChange} onBlur={handleBlur} className="mb-2" />
                              <Input name="shipper.shipmentPostalCode" placeholder="Mã bưu điện" value={values.shipper.shipmentPostalCode} onChange={handleChange} onBlur={handleBlur} className="mb-2" />
                            </div>
                            <div>
                              <div className="font-semibold mb-2">Thông tin người nhận</div>
                              <Input name="recipient.recipientName" placeholder="Tên người nhận" value={values.recipient.recipientName} onChange={handleChange} onBlur={handleBlur} className="mb-2" />
                              <Input name="recipient.recipientPhone" placeholder="Số điện thoại người nhận" value={values.recipient.recipientPhone} onChange={handleChange} onBlur={handleBlur} className="mb-2" />
                              <Input name="recipient.recipientStreetLine" placeholder="Địa chỉ" value={values.recipient.recipientStreetLine} onChange={handleChange} onBlur={handleBlur} className="mb-2" />
                              <Input name="recipient.recipientCity" placeholder="Thành phố" value={values.recipient.recipientCity} onChange={handleChange} onBlur={handleBlur} className="mb-2" />
                              <Input name="recipient.recipientCountryCode" placeholder="Mã quốc gia (VD: VN)" value={values.recipient.recipientCountryCode} onChange={handleChange} onBlur={handleBlur} className="mb-2" />
                              <Input name="recipient.recipientPostalCode" placeholder="Mã bưu điện" value={values.recipient.recipientPostalCode} onChange={handleChange} onBlur={handleBlur} className="mb-2" />
                            </div>
                          </div>
                        </>
                      )}

                      <div className="flex gap-2 mt-4">
                        {subRequest.status !== "REJECTED" && (
                          <>
                            <Button type="submit" name="submit" disabled={isSubmitting}>Gửi báo giá</Button>
                            {requestType === "OFFLINE" && (
                              <QuotationPreviewDialog subRequest={subRequest} values={values} quotationDetails={quotationDetails} handleSubmit={handleSubmit} />
                            )}
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
