import React from 'react'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const TermOfService = () => {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-col items-center justify-center gap-2">
          <CardTitle className="text-2xl">Điều khoản dịch vụ</CardTitle>
          <CardDescription>
            Các điều khoản sử dụng dịch vụ mua hộ quốc tế của GShop. Vui lòng đọc kỹ trước khi sử dụng.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold">1. Chấp nhận điều khoản</h3>
            <p>
              Bằng việc tạo tài khoản và/hoặc sử dụng dịch vụ GShop, bạn xác nhận đã đọc, hiểu và đồng ý tuân thủ các điều khoản dưới đây.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold">2. Tài khoản người dùng</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Thông tin đăng ký phải chính xác, đầy đủ và được cập nhật khi thay đổi.</li>
              <li>Bạn chịu trách nhiệm giữ bí mật thông tin đăng nhập và mọi hoạt động phát sinh từ tài khoản.</li>
              <li>GShop có quyền tạm khóa tài khoản nếu phát hiện hành vi vi phạm hoặc bất thường.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold">3. Sử dụng dịch vụ</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Không sử dụng dịch vụ để mua bán hàng cấm hoặc hàng hóa bị hạn chế theo quy định pháp luật.</li>
              <li>Không giả mạo danh tính, lạm dụng khuyến mãi hoặc thực hiện hành vi gian lận.</li>
              <li>Tuân thủ quy định của nhà cung cấp/đối tác vận chuyển và pháp luật hiện hành.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold">4. Giá, phí và thanh toán</h3>
            <p>
              Phí dịch vụ, phí vận chuyển và các khoản thuế (nếu có) sẽ được hiển thị rõ trong phần báo giá. Bạn cần thanh toán theo hướng dẫn trước khi GShop thực hiện mua hàng.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold">5. Vận chuyển và hải quan</h3>
            <p>
              Thời gian vận chuyển phụ thuộc vào đối tác và thủ tục hải quan. Có thể phát sinh chi phí hải quan/thuế theo quy định từng quốc gia, và bạn sẽ được thông báo khi áp dụng.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold">6. Đổi trả và hoàn tiền</h3>
            <p>
              Yêu cầu đổi trả/hoàn tiền được thực hiện theo chính sách hiện hành của GShop. Vui lòng tham khảo trang Chính sách đổi/hoàn trả và Chính sách hoàn tiền để biết chi tiết.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold">7. Giới hạn trách nhiệm</h3>
            <p>
              GShop không chịu trách nhiệm đối với các thiệt hại gián tiếp, ngẫu nhiên hoặc phát sinh ngoài tầm kiểm soát hợp lý, trừ khi pháp luật có quy định khác.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold">8. Thay đổi điều khoản</h3>
            <p>
              GShop có thể cập nhật điều khoản theo thời gian. Thay đổi sẽ có hiệu lực khi được đăng tải, và việc tiếp tục sử dụng dịch vụ đồng nghĩa với việc bạn chấp nhận các thay đổi đó.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold">9. Liên hệ</h3>
            <p>
              Mọi thắc mắc xin liên hệ: Email <span className="font-medium">support@gshop.vn</span> — Hotline <span className="font-medium">1900-xxxx</span>.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}

export default TermOfService