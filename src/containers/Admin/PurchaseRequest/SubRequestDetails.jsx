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
  setGroupCurrency,
  setGroupRegion,
} from "@/features/quotation"
import QuotationPreviewDialog from "./QuotationPreviewDialog"
import { getStatusColor, getStatusText } from "@/utils/statusHandler"
import RejectDialog from "@/components/RejectDialog"
import EditSubDialog from "./EditSubDialog"
import { PACKAGE_TYPE } from "@/const/packageType"
import { Select } from "@/components/ui/select"
import { CURRENCY } from "@/const/currency"
import { REGION } from "@/const/region"
import { ONLINE_FEE } from "@/const/onlineFee"

export function SubRequestDetails({ subRequest, isExpanded, onToggleExpansion, purchaseRequest, children }) {
  // Remove manual dialog open state; will use DialogTrigger pattern
  const requestType = purchaseRequest?.requestType;
  const requestStatus = purchaseRequest?.status;
  const admin = purchaseRequest.admin;
  const { addressLine, location, phoneNumber, name } = purchaseRequest.shippingAddress;
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
      dispatch(initializeSubRequest({
        subRequestId: subRequest.id,
        quotationDetails: subRequest.requestItems.map(item => ({
          requestItemId: item.id,
          quantity: item.quantity,
          hsCodeId: "",
          basePrice: 0,
          note: "",
        }))
      }));
    }
    // eslint-disable-next-line
  }, [dispatch, subRequest.id]);

  if (!quotationState) return null;

  const { quotationDetails, note, shippingEstimate, currency, region, expanded } = quotationState;
  const initialValues = {
    note: note || "",
    shippingEstimate: shippingEstimate || "",
    currency: currency || "VND",
    region: region || "",
    // ONLINE-only
    fees: [],
    // OFFLINE-only
    totalWeightEstimate: "",
    packageType: PACKAGE_TYPE?.[0]?.type,
    shipper: {
      shipmentStreetLine: "",
      shipmentCity: "",
      shipmentPostalCode: "",
      shipmentPhone: admin?.phone,
      shipmentName: "Global Shopper",
      shipmentCountryCode: region,
      shipmentStateOrProvinceCode: "",
    },
    recipient: {
      recipientStreetLine: addressLine,
      recipientCity: location?.split(",")[2],
      recipientCountryCode: "VN",
      recipientPostalCode: "",
      recipientPhone: phoneNumber,
      recipientName: name,
    },
  };

  const validationSchema = Yup.object({
    currency: Yup.string().required("Vui lòng chọn tiền tệ."),
    ...(requestType === "ONLINE"
      ? { shippingEstimate: Yup.number().typeError("Phí vận chuyển phải là số.").required("Vui lòng nhập phí vận chuyển cho nhóm.") }
      : {}),
    ...(requestType === "OFFLINE"
      ? {
        packageType: Yup.string().required("Vui lòng chọn loại gói hàng."),
        region: Yup.string().required("Vui lòng chọn khu vực."),
      }
      : {}),
  });

  return (
    <>
      <Card className={`border-l-4 ${subRequest.status === "QUOTED" || subRequest.status === "PAID" ? "border-l-blue-500" : "border-l-gray-500"}`}>
        <CardHeader>
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
            {
              subRequest.contactInfo.length > 0 &&
              <Button variant="ghost" size="sm">
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            }
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
          {((subRequest.status === "PENDING" || !subRequest.status ) && (requestStatus === "CHECKING" || requestStatus === "QUOTED" || requestStatus === "PAID")) && (
            <>
              <Button
                type="button"
                variant="link"
                className="text-blue-600 font-medium mt-2"
                onClick={() => dispatch(toggleExpandQuotation({ subRequestId: subRequest.id }))}
              >
                {expanded ? "Đóng báo giá nhóm" : "Nhập thông tin và gửi báo giá đơn hàng"}
              </Button>
              {
                purchaseRequest?.requestType === "ONLINE" && <EditSubDialog subRequest={subRequest} requestItemsGroupByPlatform={purchaseRequest?.requestItemsGroupByPlatform} />
              }
              {expanded && (
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={async (values, actions) => {
                    try {
                      if (requestType === "ONLINE") {
                        const details = quotationDetails.map((d) => ({
                          requestItemId: d.requestItemId,
                          quantity: d.quantity || 1,
                          currency: values.currency,
                          basePrice: Number(d.basePrice ?? 0),
                          serviceFee: Number(d.serviceFee ?? 0),
                        }));
                        const fees = (values.fees || [])
                          .map((f) => ({
                            feeName: (f.feeName === "__OTHER__" ? (f.customName || "") : (f.feeName || "")).trim(),
                            amount: Number(f.amount ?? 0),
                          }))
                          .filter((f) => f.feeName && !Number.isNaN(f.amount));
                        const payload = {
                          subRequestId: subRequest.id,
                          shippingEstimate: Number(values.shippingEstimate),
                          note: values.note,
                          totalPriceBeforeExchange: Number(values.totalPriceBeforeExchange),
                          fees,
                          currency: values.currency,
                          details,
                        };
                        await createQuotationOnline(payload).unwrap();
                      } else {
                        const details = quotationDetails.map((d) => ({
                          requestItemId: d.requestItemId,
                          quantity: d.quantity || 1,
                          hsCodeId: d.hsCodeId,
                          region: values.region,
                          basePrice: Number(d.basePrice ?? 0),
                          serviceFee: Number(d.serviceFee ?? 0),
                          note: d.note,
                          currency: values.currency,
                        }));
                        const payload = {
                          subRequestId: subRequest.id,
                          note: values.note,
                          details,
                          shippingEstimate: Number(values.shippingEstimate),
                          totalWeightEstimate: Number(values.totalWeightEstimate || 0),
                          packageType: values.packageType,
                          shipper: { ...values.shipper, ...(values.region ? { shipmentCountryCode: values.region } : {}) },
                          recipient: { ...values.recipient },
                          region: values.region,
                          currency: values.currency,
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
                  {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">

                      {/* Group-level currency */}
                      <div>
                        <label className="block font-medium mb-1">Tiền tệ</label>
                        <select
                          name="currency"
                          className="w-full px-3 py-2 border rounded"
                          value={values.currency}
                          onChange={(e) => {
                            handleChange(e);
                            dispatch(setGroupCurrency({ subRequestId: subRequest.id, currency: e.target.value }));
                          }}
                          onBlur={handleBlur}
                        >
                          <option value="">Chọn tiền tệ</option>
                          {CURRENCY.map((currency) => (
                            <option key={currency.value} value={currency.value}>
                              {currency.label}
                            </option>
                          ))}
                        </select>
                        {touched.currency && errors.currency && (
                          <div className="text-red-500 text-xs">{errors.currency}</div>
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
                          {/* Dynamic fees list */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block font-medium">Các loại phí (tuỳ chọn)</label>
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => setFieldValue('fees', [...(values.fees || []), { feeName: '', customName: '', amount: '' }])}
                              >
                                Thêm phí
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {(values.fees || []).map((fee, idx) => (
                                <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                                  <div className="md:col-span-6">
                                    <label className="text-xs text-muted-foreground">Tên phí</label>
                                    <select
                                      name={`fees[${idx}].feeName`}
                                      className="w-full px-3 py-2 border rounded"
                                      value={fee.feeName || ''}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setFieldValue(`fees[${idx}].feeName`, val);
                                        if (val !== '__OTHER__') {
                                          setFieldValue(`fees[${idx}].customName`, '');
                                        }
                                      }}
                                    >
                                      <option value="">Chọn loại phí</option>
                                      {ONLINE_FEE.map((name) => (
                                        <option key={name} value={name}>{name}</option>
                                      ))}
                                      <option value="__OTHER__">Khác...</option>
                                    </select>
                                  </div>
                                  {fee.feeName === '__OTHER__' && (
                                    <div className="md:col-span-4">
                                      <label className="text-xs text-muted-foreground">Tên phí tuỳ chỉnh</label>
                                      <Input
                                        name={`fees[${idx}].customName`}
                                        placeholder="Nhập tên phí"
                                        value={fee.customName || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                    </div>
                                  )}
                                  <div className={fee.feeName === '__OTHER__' ? 'md:col-span-2' : 'md:col-span-4'}>
                                    <label className="text-xs text-muted-foreground">Số tiền</label>
                                    <Input
                                      name={`fees[${idx}].amount`}
                                      type="number"
                                      step="0.01"
                                      placeholder={`Số tiền (${values.currency})`}
                                      value={fee.amount}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                  </div>
                                  <div className="col-span-2 md:col-span-2 flex justify-end self-end mb-1">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      className="text-red-600"
                                      onClick={() => {
                                        const next = [...(values.fees || [])];
                                        next.splice(idx, 1);
                                        setFieldValue('fees', next);
                                      }}
                                    >
                                      Xoá
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                      {requestType === "OFFLINE" && (
                        <>
                          {/* Group-level region (OFFLINE) */}
                          <div>
                            <label className="block font-medium mb-1">Khu vực</label>
                            <select
                              name="region"
                              className="w-full px-3 py-2 border rounded"
                              value={values.region}
                              onChange={(e) => {
                                handleChange(e);
                                dispatch(setGroupRegion({ subRequestId: subRequest.id, region: e.target.value }));
                                setFieldValue('shipper.shipmentCountryCode', e.target.value);
                              }}
                              onBlur={handleBlur}
                            >
                              <option value="">Chọn khu vực</option>
                              {REGION.map((region) => (
                                <option key={region.value} value={region.value}>
                                  {region.label}
                                </option>
                              ))}
                            </select>
                            {touched.region && errors.region && (
                              <div className="text-red-500 text-xs">{errors.region}</div>
                            )}
                          </div>
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
                              <Input name="shipper.shipmentCountryCode" placeholder="Mã quốc gia (VD: VN)" value={values.shipper.shipmentCountryCode} readOnly className="mb-2" />
                              {values?.region === "US" && (
                                <Input name="shipper.shipmentStateOrProvinceCode" placeholder="Tiểu bang" value={values.shipper.shipmentStateOrProvinceCode} onChange={handleChange} onBlur={handleBlur} className="mb-2" />
                              )}
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
                      <div>
                        <label className="block font-medium mb-1">Ghi chú cho báo giá</label>
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
                      </div>

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
