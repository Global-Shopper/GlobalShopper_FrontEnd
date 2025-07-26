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
  setItemDetail,
  setGroupNote,
  setShippingEstimate,
  toggleExpandQuotation,
  initializeSubRequest
} from "@/features/quotation"
import { QuotationForm } from "./QuotationForm"


export function SubRequestDetails({ subRequest, index, isExpanded, onToggleExpansion, requestType, children }) {
  const getDisplayTitle = () => {
    if (subRequest.contactInfo && subRequest.contactInfo.length > 0) {
      return subRequest.contactInfo[0]
    }
    return subRequest.seller
  }

  const dispatch = useDispatch();
  const quotationState = useSelector(state => state.rootReducer.quotation?.subRequests?.[subRequest.id]);
  // API mutation (must be above early return)
  const [createQuotation, { isLoading: isQuotationLoading }] = useCreateQuotationMutation();

  useEffect(() => {
    if (!quotationState) {
      dispatch(initializeSubRequest({
        subRequestId: subRequest.id,
        itemDetails: subRequest.requestItems.map(item => ({
          requestItemId: item.id,
          hsCodeId: "",
          region: "",
          basePrice: "",
          serviceFee: "100000",
          note: "",
          currency: "VND"
        }))
      }));
    }
    // eslint-disable-next-line
  }, [dispatch, subRequest.id]);

  if (!quotationState) return null;

  const { itemDetails, note, shippingEstimate, expanded } = quotationState;
  console.log(quotationState)
  const initialValues = {
    details: itemDetails,
    note: note || "",
    shippingEstimate: shippingEstimate || ""
  };

  const validationSchema = Yup.object({
    note: Yup.string().required("Vui lòng nhập ghi chú cho nhóm."),
    shippingEstimate: Yup.number().typeError("Phí vận chuyển phải là số.").required("Vui lòng nhập phí vận chuyển cho nhóm."),
    details: Yup.array().of(Yup.object({
      basePrice: Yup.number().required("Giá gốc là bắt buộc"),
      hsCodeId: Yup.string().required("HS Code là bắt buộc"),
      region: Yup.string().required("Khu vực là bắt buộc"),
      serviceFee: Yup.number().required("Phí dịch vụ là bắt buộc"),
      currency: Yup.string().required("Tiền tệ là bắt buộc"),
    }))
  });

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => onToggleExpansion(index)}>
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
            <Badge variant="outline" className="text-xs">
              {subRequest.requestItems.length} sản phẩm
            </Badge>
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
        <Button
          type="button"
          variant="link"
          className="text-blue-600 font-medium mt-2"
          onClick={() => dispatch(toggleExpandQuotation({ subRequestId: subRequest.id }))}
        >
          {expanded ? "Đóng báo giá nhóm" : "Nhập thông tin và gửi báo giá đơn hàng"}
        </Button>
        {expanded && (
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, actions) => {
              // Build details from itemDetails state
              const details = itemDetails.map((detail) => ({
                ...detail,
              }));
              const payload = {
                subRequestId: subRequest.id,
                note: values.note,
                shippingEstimate: Number(values.shippingEstimate),
                details,
                expiredDate: 1
              };
              try {
                await createQuotation(payload).unwrap()
                .then(() => toast.success("Gửi báo giá thành công!"))
                dispatch(toggleExpandQuotation({ subRequestId: subRequest.id }));
              } catch (err) {
                toast.error("Gửi báo giá thất bại!" + (err?.data?.message ? `: ${err.data.message}` : ""));
              }
              actions.setSubmitting(false);
            }}
          >
             {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {/* Render QuotationForm for each item in itemDetails */}
                {itemDetails.map((item, idx) => (
                  <QuotationForm
                  key={item.requestItemId}
                  index={idx}
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={e => {
                      handleChange(e);
                      // Also update Redux for each field
                      const fieldName = e.target.name.match(/details\[(\d+)\]\.(\w+)/);
                      if (fieldName) {
                        const [, itemIdx, field] = fieldName;
                        console.log(fieldName);
                        dispatch(setItemDetail({
                          subRequestId: subRequest.id,
                          itemIndex: Number(itemIdx),
                          field,
                          value: e.target.value
                        }));
                      }
                    }}
                    handleBlur={handleBlur}
                  />
                ))}

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
                  <Button type="submit" disabled={isSubmitting}>Gửi báo giá</Button>
                </div>
              </form>
            )}
          </Formik>
        )}
      </CardContent>
    </Card>
  )
}
