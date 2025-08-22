import React from 'react'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const Pricing = () => {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-col items-center justify-center gap-2">
          <CardTitle className="text-2xl">Bảng giá</CardTitle>
          <CardDescription>
            Thông tin minh bạch về phí dịch vụ, phí vận chuyển quốc tế và công thức tính tổng chi phí.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold">1. Giới thiệu chung</h3>
            <p>
              Mọi báo giá mua hộ quốc tế được tính dựa trên giá sản phẩm gốc, phí dịch vụ cố định và phí vận chuyển quốc tế. GShop cam kết minh bạch, không phụ phí ẩn.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold">2. Phí dịch vụ mua hộ</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Phí dịch vụ hiện tại: <span className="font-medium">10%</span> trên giá trị sản phẩm.</li>
              <li>Phí có thể được điều chỉnh theo cấu hình hệ thống trong tương lai.</li>
              <li>Áp dụng cho toàn bộ đơn hàng, không có phụ phí ẩn.</li>
            </ul>
            <div className="mt-3 rounded-md bg-muted p-4">
              <p className="font-medium">Lợi ích khi sử dụng dịch vụ:</p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Mua hàng quốc tế nhanh chóng, thuận tiện.</li>
                <li>Thanh toán quốc tế an toàn, bảo mật.</li>
                <li>Minh bạch chi phí, đảm bảo chất lượng sản phẩm.</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold">3. Phí vận chuyển quốc tế</h3>
            <p>Khách hàng có thể lựa chọn hãng vận chuyển phù hợp theo nhu cầu. Các đối tác phổ biến gồm FedEx, UPS, DHL, v.v.</p>
            <div className="mt-2 rounded-md bg-muted p-4">
              <p className="font-medium">Lưu ý:</p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Chi phí phụ thuộc trọng lượng, kích thước, tuyến đường và điểm đến.</li>
                <li>Hệ thống báo giá hiển thị tổng chi phí dự kiến, đã bao gồm phí vận chuyển quốc tế ước tính.</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold">4. Công thức tính báo giá</h3>
            <p>
              Tổng chi phí = Giá sản phẩm + Thuế (nếu có) + Phí dịch vụ (10% giá sản phẩm) + Phí vận chuyển quốc tế
            </p>
            <div className="mt-3 rounded-md border p-4">
              <p className="font-medium">Ví dụ minh họa</p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Giá sản phẩm: 100 USD</li>
                <li>Thuế: 0 USD</li>
                <li>Phí dịch vụ (10% của giá sản phẩm): 10 USD</li>
                <li>Phí vận chuyển quốc tế (ước tính): 25 USD</li>
              </ul>
              <p className="mt-2">Tổng cộng = <span className="font-semibold">135 USD</span></p>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}

export default Pricing