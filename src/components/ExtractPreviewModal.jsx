import React from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ExtractPreviewModal({ open, onClose, onApply, product }) {
  if (!product) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
          <h2 className="text-lg font-bold mb-3 text-blue-700">Xem trước thông tin sản phẩm</h2>
          <div className="space-y-2 mb-4">
            <div className="font-medium">Tên sản phẩm: <span className="font-normal">{product.name || "-"}</span></div>
            <div className="font-medium">Mô tả: <span className="font-normal">{product.description || "-"}</span></div>
            <div className="font-medium">Số lượng: <span className="font-normal">{product.quantity || 1}</span></div>
            {product.variants && product.variants.length > 0 && (
              <div className="font-medium">Thuộc tính sản phẩm:
                <span className="font-normal"> {product.variants.join(", ")}</span>
              </div>
            )}
            {product.images && product.images.length > 0 && (
              <div className="flex gap-2 mt-2">
                {product.images.map((img, i) => (
                  <img key={i} src={img} alt="Ảnh sản phẩm" className="w-16 h-16 object-cover rounded border" />
                ))}
              </div>
            )}
            <div className="text-sm text-red-500 mt-2">
              Lưu ý: Thông tin của AI đưa ra có thể không chính xác, vui lòng kiểm tra lại thông tin.
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-6">
            <Button variant="outline" onClick={onClose}>Bỏ qua</Button>
            <Button onClick={onApply} className="bg-blue-600 hover:bg-blue-700 text-white">Áp dụng</Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
