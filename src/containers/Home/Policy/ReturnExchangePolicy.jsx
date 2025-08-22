import React from 'react'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const ReturnExchangePolicy = () => {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Chính sách đổi/hoàn trả GShop</CardTitle>
          <CardDescription>
            Minh bạch, công bằng và xử lý nhanh chóng mọi yêu cầu đổi hoặc trả hàng.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold">1. Giới thiệu</h3>
            <p>
              Chính sách đổi/hoàn trả của GShop được xây dựng nhằm bảo vệ quyền lợi khách hàng khi nhận sản phẩm không đúng mong đợi.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold">2. Điều kiện áp dụng</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Sai loại, mẫu mã, kích thước, màu sắc so với yêu cầu.</li>
              <li>Hư hỏng, bể vỡ, trầy xước nghiêm trọng khi vận chuyển (cần video/ảnh mở hộp).</li>
              <li>Lỗi sản xuất hoặc lỗi từ nhà cung cấp.</li>
              <li>Không giống mô tả hoặc thông tin đã xác nhận trước đó.</li>
            </ul>
            <p className="mt-2">Lưu ý: Gửi yêu cầu trong vòng 48 giờ kể từ khi nhận hàng và kèm đầy đủ bằng chứng.</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold">3. Trường hợp không áp dụng</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Sản phẩm đã sử dụng, giặt, tháo tem mác, không còn nguyên trạng.</li>
              <li>Đổi ý sau khi đơn đã mua và vận chuyển.</li>
              <li>Danh mục hạn chế (hàng dễ vỡ đặc biệt, thực phẩm, mỹ phẩm đã mở nắp, sản phẩm cá nhân hóa).</li>
              <li>Không cung cấp đủ bằng chứng hợp lệ hoặc khiếu nại quá 48 giờ.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold">4. Quy trình xử lý</h3>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Gửi yêu cầu trên ứng dụng/web GShop, chọn đơn hàng và cung cấp bằng chứng.</li>
              <li>Xác minh thông tin, phân loại lỗi (khách hàng/NCC/vận chuyển).</li>
              <li>Phương án: Đổi sản phẩm khác, trả hàng và hoàn tiền, hoặc hoàn một phần.</li>
              <li>Thời gian phản hồi: trong 48 giờ làm việc kể từ khi tiếp nhận yêu cầu.</li>
            </ol>
          </section>

          <section>
            <h3 className="text-lg font-semibold">5. Chi phí đổi/hoàn trả</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Miễn phí nếu lỗi từ GShop, nhà cung cấp hoặc đơn vị vận chuyển.</li>
              <li>Khách hàng chịu phí nếu lý do cá nhân (không còn nhu cầu, đặt nhầm nhưng GShop đã mua đúng).</li>
              <li>Phí đổi trả sẽ được thông báo rõ ràng trước khi tiến hành.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold">6. Phương thức hoàn trả</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Hoàn tiền vào Ví GShop (ưu tiên, nhanh nhất) hoặc theo phương thức thanh toán ban đầu.</li>
              <li>Thời gian hoàn tiền: 24–48 giờ (Ví GShop) hoặc 3–7 ngày (ngân hàng/VNPay).</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold">7. Cam kết dịch vụ</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Đặt quyền lợi khách hàng lên hàng đầu.</li>
              <li>Xử lý minh bạch, có thể theo dõi trực tiếp trên ứng dụng.</li>
              <li>Chính sách có thể thay đổi theo quốc gia, nhà cung cấp hoặc đối tác vận chuyển.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold">8. Liên hệ</h3>
            <p>
              Email: <span className="font-medium">support@gshop.vn</span> — Hotline: <span className="font-medium">1900-xxxx</span>
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}

export default ReturnExchangePolicy