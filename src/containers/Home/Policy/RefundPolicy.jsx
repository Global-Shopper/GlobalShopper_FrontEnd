import React from 'react'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const RefundPolicy = () => {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Chính sách hoàn tiền GShop</CardTitle>
          <CardDescription>
            Minh bạch, nhanh chóng và bảo vệ quyền lợi khách hàng trong mọi giao dịch.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold">1. Giới thiệu</h3>
            <p>
              Chính sách hoàn tiền của GShop được xây dựng nhằm bảo vệ quyền lợi của khách hàng. Mọi trường hợp hoàn tiền có thể được xử lý qua Ví GShop hoặc theo phương thức thanh toán ban đầu (tùy tình huống).
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold">2. Trường hợp được hoàn tiền 100%</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Sản phẩm không còn hàng hoặc nhà cung cấp hủy đơn.</li>
              <li>Phát sinh lỗi hệ thống, lỗi thanh toán (không thuộc về khách hàng).</li>
              <li>Đặt nhầm sản phẩm/sai mã/sai loại từ GShop hoặc nhà cung cấp.</li>
            </ul>
            <p className="mt-2">Tiền sẽ hoàn vào Ví GShop trong 24–48 giờ làm việc sau khi xác minh.</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold">3. Theo chính sách sàn TMĐT</h3>
            <p>Trường hợp sản phẩm không đúng mô tả hoặc không giống yêu cầu ban đầu:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Cung cấp video mở hộp (unboxing) và thông tin đơn hàng.</li>
              <li>Đối chiếu với chính sách của sàn (Amazon, Taobao, Rakuten, …).</li>
              <li>Mức hoàn có thể 100% hoặc một phần, tùy quy định sàn.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold">4. Trường hợp không được hoàn tiền</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Đổi ý hoặc không muốn nhận hàng sau khi đã mua và vận chuyển.</li>
              <li>Thất lạc do đơn vị vận chuyển quốc tế (trừ khi có bảo hiểm GShop).</li>
              <li>Không cung cấp bằng chứng hợp lệ theo yêu cầu khiếu nại.</li>
              <li>Cố tình gian lận hoặc khai báo sai sự thật.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold">5. Quy trình yêu cầu hoàn tiền</h3>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Gửi yêu cầu trong ứng dụng/web GShop (mã đơn, lý do, bằng chứng).</li>
              <li>Xác minh thông tin, phân loại lỗi.</li>
              <li>Thông báo kết quả trong vòng 48 giờ.</li>
              <li>Hoàn tiền về Ví GShop hoặc theo phương thức thanh toán ban đầu.</li>
            </ol>
          </section>

          <section>
            <h3 className="text-lg font-semibold">6. Thời gian xử lý</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>24–48 giờ làm việc: Hoàn về Ví GShop.</li>
              <li>3–7 ngày làm việc: Hoàn qua ngân hàng hoặc VNPay (phụ thuộc ngân hàng).</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold">7. Biện pháp chống gian lận</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Tạm khóa tài khoản nếu phát hiện khiếu nại sai sự thật.</li>
              <li>Theo dõi tài khoản có nhiều khiếu nại bất thường.</li>
              <li>Từ chối hoàn tiền với các trường hợp vi phạm.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold">8. Cam kết minh bạch</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Ưu tiên quyền lợi khách hàng chính đáng.</li>
              <li>Quy trình minh bạch, theo dõi trực tiếp trên ứng dụng.</li>
              <li>Thay đổi chính sách (nếu có) sẽ thông báo qua email và cập nhật trên website/app.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold">9. Liên hệ</h3>
            <p>
              Email: <span className="font-medium">support@gshop.vn</span> — Hotline: <span className="font-medium">1900-xxxx</span>
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}

export default RefundPolicy