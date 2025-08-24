import React from 'react'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto py-8 px-20">
      <Card>
        <CardHeader className="flex flex-col items-center justify-center gap-2">
          <CardTitle className="text-2xl">Chính sách bảo mật GShop</CardTitle>
          <CardDescription>
            GShop cam kết bảo vệ dữ liệu cá nhân của khách hàng trong suốt quá trình sử dụng dịch vụ mua hộ quốc tế.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold">1. Giới thiệu</h3>
            <p>
              Chính sách này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin của bạn. Việc sử dụng GShop đồng nghĩa với việc bạn đồng ý cho phép GShop xử lý dữ liệu cá nhân theo chính sách này.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold">2. Thông tin chúng tôi thu thập</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Thông tin cá nhân: Họ tên, email, số điện thoại, địa chỉ giao hàng.</li>
              <li>Thông tin giao dịch: Lịch sử đơn hàng, chi tiết thanh toán, số tiền nạp/rút Ví GShop.</li>
              <li>Thông tin kỹ thuật: Địa chỉ IP, loại thiết bị, trình duyệt, cookies, lịch sử đăng nhập.</li>
              <li>Thông tin bổ sung: Hình ảnh, video, chứng từ phục vụ khiếu nại, đổi trả, hoàn tiền.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold">3. Mục đích sử dụng thông tin</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Xử lý đơn hàng, thanh toán và giao nhận.</li>
              <li>Gửi thông báo trạng thái đơn hàng, xác nhận thanh toán, khuyến mãi.</li>
              <li>Hỗ trợ khách hàng (hoàn tiền, đổi trả, khiếu nại).</li>
              <li>Ngăn chặn gian lận, lừa đảo hoặc vi phạm điều khoản dịch vụ.</li>
              <li>Cải thiện trải nghiệm và tối ưu dịch vụ GShop.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold">4. Chia sẻ thông tin với bên thứ ba</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Với đối tác logistics để giao hàng.</li>
              <li>Với cổng thanh toán (VNPay, ngân hàng) để xử lý giao dịch.</li>
              <li>Với cơ quan nhà nước có thẩm quyền khi có yêu cầu hợp pháp.</li>
            </ul>
            <p className="mt-2">GShop không bán hoặc cho thuê thông tin khách hàng cho bên thứ ba.</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold">5. Bảo mật dữ liệu</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Sử dụng mã hóa SSL và công nghệ bảo mật để bảo vệ dữ liệu.</li>
              <li>Thông tin nhạy cảm được lưu trữ mã hóa và hạn chế truy cập.</li>
              <li>Nhân viên chỉ được truy cập dữ liệu trong phạm vi cần thiết.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold">6. Quyền của khách hàng</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Truy cập thông tin cá nhân bất kỳ lúc nào.</li>
              <li>Yêu cầu chỉnh sửa nếu thông tin không chính xác.</li>
              <li>Yêu cầu xóa tài khoản và dữ liệu cá nhân (trừ trường hợp theo luật).</li>
              <li>Từ chối nhận email marketing qua hủy đăng ký.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold">7. Thời gian lưu trữ</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Lưu trữ trong suốt quá trình sử dụng dịch vụ.</li>
              <li>Sau khi xóa tài khoản, dữ liệu được ẩn hoặc xóa trong 90 ngày (trừ trường hợp theo luật).</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold">8. Cookie & công nghệ theo dõi</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Ghi nhớ thông tin đăng nhập.</li>
              <li>Phân tích hành vi sử dụng để tối ưu trải nghiệm.</li>
              <li>Cung cấp quảng cáo cá nhân hóa.</li>
            </ul>
            <p className="mt-2">Bạn có thể tắt cookies trong trình duyệt, nhưng một số chức năng có thể bị hạn chế.</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold">9. Thay đổi chính sách bảo mật</h3>
            <p>Chúng tôi có thể cập nhật chính sách và sẽ thông báo qua email và trên website.</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold">10. Liên hệ</h3>
            <p>
              Email: <span className="font-medium">support@gshop.vn</span> — Hotline: <span className="font-medium">1900-xxxx</span>
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}

export default PrivacyPolicy