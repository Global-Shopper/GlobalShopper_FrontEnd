import React from 'react'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'

const FAQ = () => {
  return (
    <div className="container mx-auto py-8 px-20">
      <Card>
        <CardHeader className="flex flex-col items-center justify-center gap-2">
          <CardTitle className="text-2xl">Câu hỏi thường gặp (FAQ)</CardTitle>
          <CardDescription>Những thắc mắc phổ biến về dịch vụ mua hộ quốc tế của GShop.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 1 */}
          <Collapsible>
            <CollapsibleTrigger className="w-full text-left font-medium py-3 px-4 rounded-md hover:bg-muted flex items-center justify-between">
              <span>1. Dịch vụ mua hộ của Global Shopper là gì?</span>
              <span className="ml-2">▾</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <p>
                Chúng tôi hỗ trợ mua sản phẩm từ các trang TMĐT quốc tế (Amazon, eBay, …) hoặc cửa hàng nước ngoài và vận chuyển về Việt Nam. Bạn gửi link hoặc thông tin sản phẩm, chúng tôi sẽ báo giá và xử lý toàn bộ quy trình.
              </p>
            </CollapsibleContent>
          </Collapsible>

          {/* 2 */}
          <Collapsible>
            <CollapsibleTrigger className="w-full text-left font-medium py-3 px-4 rounded-md hover:bg-muted flex items-center justify-between">
              <span>2. Tôi cần chuẩn bị gì để sử dụng dịch vụ mua hộ?</span>
              <span className="ml-2">▾</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <ul className="list-disc pl-6 space-y-1">
                <li>Link sản phẩm hoặc thông tin chi tiết (tên, màu, size, hình ảnh).</li>
                <li>Địa chỉ nhận hàng tại Việt Nam.</li>
                <li>Phương thức thanh toán (chuyển khoản ngân hàng, ví điện tử, …).</li>
              </ul>
            </CollapsibleContent>
          </Collapsible>

          {/* 3 */}
          <Collapsible>
            <CollapsibleTrigger className="w-full text-left font-medium py-3 px-4 rounded-md hover:bg-muted flex items-center justify-between">
              <span>3. Phí dịch vụ được tính như thế nào?</span>
              <span className="ml-2">▾</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <p>Phí dịch vụ là 10% trên giá trị sản phẩm (không tính thuế/phí vận chuyển).</p>
              <p>Ví dụ: Sản phẩm 100 USD → phí dịch vụ 10 USD.</p>
            </CollapsibleContent>
          </Collapsible>

          {/* 4 */}
          <Collapsible>
            <CollapsibleTrigger className="w-full text-left font-medium py-3 px-4 rounded-md hover:bg-muted flex items-center justify-between">
              <span>4. Ngoài phí dịch vụ còn chi phí nào khác?</span>
              <span className="ml-2">▾</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <ul className="list-disc pl-6 space-y-1">
                <li>Thuế nhập khẩu/VAT (nếu có).</li>
                <li>Phí vận chuyển quốc tế (FedEx, UPS, …).</li>
                <li>Phí vận chuyển nội địa tại Việt Nam.</li>
              </ul>
            </CollapsibleContent>
          </Collapsible>

          {/* 5 */}
          <Collapsible>
            <CollapsibleTrigger className="w-full text-left font-medium py-3 px-4 rounded-md hover:bg-muted flex items-center justify-between">
              <span>5. Tôi có thể chọn hãng vận chuyển quốc tế không?</span>
              <span className="ml-2">▾</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <p> Có. Hỗ trợ nhiều đối tác: FedEx, UPS, DHL, … Khách hàng có thể chọn theo tốc độ/chi phí.</p>
            </CollapsibleContent>
          </Collapsible>

          {/* 6 */}
          <Collapsible>
            <CollapsibleTrigger className="w-full text-left font-medium py-3 px-4 rounded-md hover:bg-muted flex items-center justify-between">
              <span>6. Tôi có thể biết trước tổng chi phí không?</span>
              <span className="ml-2">▾</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <p>Hệ thống báo giá hiển thị: Giá sản phẩm + Phí dịch vụ + Phí vận chuyển + Thuế (nếu có).</p>
            </CollapsibleContent>
          </Collapsible>

          {/* 7 */}
          <Collapsible>
            <CollapsibleTrigger className="w-full text-left font-medium py-3 px-4 rounded-md hover:bg-muted flex items-center justify-between">
              <span>7. Nếu sản phẩm bị mất hoặc hư hỏng khi vận chuyển?</span>
              <span className="ml-2">▾</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <p>Chúng tôi phối hợp đơn vị vận chuyển để bồi thường theo chính sách bảo hiểm hàng hóa của đối tác.</p>
            </CollapsibleContent>
          </Collapsible>

          {/* 8 */}
          <Collapsible>
            <CollapsibleTrigger className="w-full text-left font-medium py-3 px-4 rounded-md hover:bg-muted flex items-center justify-between">
              <span>8. Thời gian nhận hàng mất bao lâu?</span>
              <span className="ml-2">▾</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <ul className="list-disc pl-6 space-y-1">
                <li>Mỹ/Châu Âu: 7–15 ngày làm việc.</li>
                <li>Nhật/Hàn/Trung Quốc: 5–10 ngày làm việc.</li>
              </ul>
              <p>Thời gian có thể thay đổi theo hãng vận chuyển và hải quan.</p>
            </CollapsibleContent>
          </Collapsible>

          {/* 9 */}
          <Collapsible>
            <CollapsibleTrigger className="w-full text-left font-medium py-3 px-4 rounded-md hover:bg-muted flex items-center justify-between">
              <span>9. Tôi có thể hủy đơn hàng sau khi đã đặt?</span>
              <span className="ml-2">▾</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <p>Có thể hủy trước khi chúng tôi mua hàng từ nhà cung cấp. Sau khi đã thanh toán cho người bán quốc tế, đơn không thể hủy.</p>
            </CollapsibleContent>
          </Collapsible>

          {/* 10 */}
          <Collapsible>
            <CollapsibleTrigger className="w-full text-left font-medium py-3 px-4 rounded-md hover:bg-muted flex items-center justify-between">
              <span>10. Tôi phải thanh toán khi nào?</span>
              <span className="ml-2">▾</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <p>Thanh toán 100% giá sản phẩm + phí dịch vụ trước khi mua hàng. Phí vận chuyển quốc tế thanh toán trước khi giao hàng tại Việt Nam.</p>
            </CollapsibleContent>
          </Collapsible>

          {/* 11 */}
          <Collapsible>
            <CollapsibleTrigger className="w-full text-left font-medium py-3 px-4 rounded-md hover:bg-muted flex items-center justify-between">
              <span>11. Tôi có thể mua nhiều sản phẩm trong cùng một đơn?</span>
              <span className="ml-2">▾</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <p>Có. Có thể gộp nhiều sản phẩm/nhà bán. Hệ thống tự động tính phí dịch vụ và vận chuyển theo tổng đơn.</p>
            </CollapsibleContent>
          </Collapsible>

          {/* 12 */}
          <Collapsible>
            <CollapsibleTrigger className="w-full text-left font-medium py-3 px-4 rounded-md hover:bg-muted flex items-center justify-between">
              <span>12. Làm sao theo dõi đơn hàng?</span>
              <span className="ml-2">▾</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <ul className="list-disc pl-6 space-y-1">
                <li>Mã tracking quốc tế (FedEx, UPS, …).</li>
                <li>Cập nhật trạng thái đơn hàng qua hệ thống.</li>
              </ul>
            </CollapsibleContent>
          </Collapsible>

          {/* 13 */}
          <Collapsible>
            <CollapsibleTrigger className="w-full text-left font-medium py-3 px-4 rounded-md hover:bg-muted flex items-center justify-between">
              <span>13. Có giới hạn sản phẩm được mua hộ không?</span>
              <span className="ml-2">▾</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <p>Không hỗ trợ mua hàng bị cấm nhập khẩu vào Việt Nam. Với hàng đặc thù (mỹ phẩm, thực phẩm, pin, …) hãy liên hệ để được tư vấn.</p>
            </CollapsibleContent>
          </Collapsible>

          {/* 14 */}
          <Collapsible>
            <CollapsibleTrigger className="w-full text-left font-medium py-3 px-4 rounded-md hover:bg-muted flex items-center justify-between">
              <span>14. Liên hệ hỗ trợ?</span>
              <span className="ml-2">▾</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <ul className="list-disc pl-6 space-y-1">
                <li>Hotline: 1900-xxxx</li>
                <li>Email: support@gshop.vn</li>
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  )
}

export default FAQ