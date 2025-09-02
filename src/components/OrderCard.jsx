import React, { useState } from "react";
import { Package, Calendar, MoreVertical, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/utils/parseDateTime";
import { getStatusBadgeVariant, getStatusText } from "@/utils/statusHandler";
import { formatCurrency } from "@/utils/formatCurrency";

export default function OrderCard({ order, onCancel, cancelling }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <Card className="shadow-sm hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 bg-white">
      <CardContent className="px-3 py-0">
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-bold text-blue-600">
              #{order.id}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500 font-medium">
              {formatDate(order.createdAt)}
            </div>
            {order.status === 'ORDER_REQUESTED' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem
                    onSelect={e => { e.preventDefault(); setIsDialogOpen(true); }}
                    className="text-red-600 cursor-pointer"
                  >
                    Hủy đơn hàng
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500 font-medium">Tổng tiền:</span>
                <span className="text-xs font-semibold text-orange-800 bg-orange-50 px-2 py-1 rounded">
                  {formatCurrency(order.totalPrice + order.shippingFee, "VND", "vn")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Package className="h-4 w-4 text-gray-400" />
                <span className="text-xs text-gray-500">{order.orderItems.length} sản phẩm</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 font-medium">Trạng thái:</span>
                <Badge variant={getStatusBadgeVariant(order.status)} className="px-2 py-1 text-xs font-medium border-blue-200 text-blue-700 bg-blue-50">
                  {getStatusText(order.status)}
                </Badge>
              </div>
            </div>
            							{/* Shipping Address */}
							<div className="flex items-center gap-2">
								<div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
									<MapPin className="h-3 w-3 text-green-600" />
								</div>
								<div className="text-sm flex-1 min-w-0">
									<div className="font-semibold text-gray-800 truncate">
										{order.shippingAddress?.name}
									</div>
									<div className="text-gray-500 text-xs truncate">
										{order.shippingAddress?.location}
									</div>
									<div className="text-gray-500 text-xs">
										{order.shippingAddress?.phoneNumber}
									</div>
								</div>
							</div>
          </div>
        </div>
        {/* Cancel confirmation dialog */}
        {order.status === 'ORDER_REQUESTED' && isDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded shadow-lg p-6 max-w-xs w-full">
              <div className="font-semibold mb-2">Xác nhận hủy đơn hàng</div>
              <div className="text-sm text-gray-600 mb-4">
                Bạn có chắc chắn muốn hủy đơn hàng #{order.id}?
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={cancelling}
                  onClick={() => { onCancel(order.id); setIsDialogOpen(false); }}
                >
                  {cancelling ? 'Đang hủy...' : 'Xác nhận'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
