import React, { useState } from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from "@/components/ui/collapsible";
import { HelpCircle, ChevronDown, ChevronRight } from "lucide-react";

const FAQ = () => {
	const [openItems, setOpenItems] = useState({});

	const toggleItem = (index) => {
		setOpenItems((prev) => ({
			...prev,
			[index]: !prev[index],
		}));
	};

	const faqData = [
		{
			question: "Dịch vụ mua hộ của Global Shopper là gì?",
			answer: "Chúng tôi hỗ trợ mua sản phẩm từ các trang TMĐT quốc tế (Amazon, eBay, …) hoặc cửa hàng nước ngoài và vận chuyển về Việt Nam. Bạn gửi link hoặc thông tin sản phẩm, chúng tôi sẽ báo giá và xử lý toàn bộ quy trình.",
		},
		{
			question: "Tôi cần chuẩn bị gì để sử dụng dịch vụ mua hộ?",
			answer: [
				"Link sản phẩm hoặc thông tin chi tiết (tên, màu, size, hình ảnh).",
				"Địa chỉ nhận hàng tại Việt Nam.",
				"Phương thức thanh toán (chuyển khoản ngân hàng, ví điện tử, …).",
			],
		},
		{
			question: "Phí dịch vụ được tính như thế nào?",
			answer: "Phí dịch vụ là 10% trên giá trị sản phẩm (không tính thuế/phí vận chuyển). Ví dụ: Sản phẩm 100 USD → phí dịch vụ 10 USD.",
		},
		{
			question: "Ngoài phí dịch vụ còn chi phí nào khác?",
			answer: [
				"Thuế nhập khẩu/VAT (nếu có).",
				"Phí vận chuyển quốc tế (FedEx, UPS, …).",
				"Phí vận chuyển nội địa tại Việt Nam.",
			],
		},
		{
			question: "Tôi có thể chọn hãng vận chuyển quốc tế không?",
			answer: "Có. Hỗ trợ nhiều đối tác: FedEx, UPS, DHL, … Khách hàng có thể chọn theo tốc độ/chi phí.",
		},
		{
			question: "Tôi có thể biết trước tổng chi phí không?",
			answer: "Hệ thống báo giá hiển thị: Giá sản phẩm + Phí dịch vụ + Phí vận chuyển + Thuế (nếu có).",
		},
		{
			question: "Nếu sản phẩm bị mất hoặc hư hỏng khi vận chuyển?",
			answer: "Chúng tôi phối hợp đơn vị vận chuyển để bồi thường theo chính sách bảo hiểm hàng hóa của đối tác.",
		},
		{
			question: "Thời gian nhận hàng mất bao lâu?",
			answer: [
				"Mỹ/Châu Âu: 7–15 ngày làm việc.",
				"Nhật/Hàn/Trung Quốc: 5–10 ngày làm việc.",
				"Thời gian có thể thay đổi theo hãng vận chuyển và hải quan.",
			],
		},
		{
			question: "Tôi có thể hủy đơn hàng sau khi đã đặt?",
			answer: "Có thể hủy trước khi chúng tôi mua hàng từ nhà cung cấp. Sau khi đã thanh toán cho người bán quốc tế, đơn không thể hủy.",
		},
		{
			question: "Tôi phải thanh toán khi nào?",
			answer: "Thanh toán 100% giá sản phẩm + phí dịch vụ trước khi mua hàng. Phí vận chuyển quốc tế thanh toán trước khi giao hàng tại Việt Nam.",
		},
		{
			question: "Tôi có thể mua nhiều sản phẩm trong cùng một đơn?",
			answer: "Có. Có thể gộp nhiều sản phẩm/nhà bán. Hệ thống tự động tính phí dịch vụ và vận chuyển theo tổng đơn.",
		},
		{
			question: "Làm sao theo dõi đơn hàng?",
			answer: [
				"Mã tracking quốc tế (FedEx, UPS, …).",
				"Cập nhật trạng thái đơn hàng qua hệ thống.",
			],
		},
		{
			question: "Có giới hạn sản phẩm được mua hộ không?",
			answer: "Không hỗ trợ mua hàng bị cấm nhập khẩu vào Việt Nam. Với hàng đặc thù (mỹ phẩm, thực phẩm, pin, …) hãy liên hệ để được tư vấn.",
		},
		{
			question: "Liên hệ hỗ trợ?",
			answer: ["Hotline: 1900-xxxx", "Email: support@gshop.vn"],
		},
	];

	return (
		<div className="min-h-screen bg-white">
			<div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-4xl">
				{/* Header Section */}
				<div className="text-center mb-12">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl shadow-lg mb-6">
						<HelpCircle className="h-8 w-8 text-white" />
					</div>
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Câu hỏi thường gặp (FAQ)
					</h1>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
						Những thắc mắc phổ biến về dịch vụ mua hộ quốc tế của
						GShop. Tìm câu trả lời nhanh chóng cho mọi thắc mắc của
						bạn.
					</p>
				</div>
				{/* FAQ Items */}
				<div className="space-y-4">
					{faqData.map((item, index) => (
						<Card
							key={index}
							className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
						>
							<Collapsible
								open={openItems[index]}
								onOpenChange={() => toggleItem(index)}
							>
								<CollapsibleTrigger className="w-full p-6 text-left hover:bg-gray-50 transition-colors rounded-lg">
									<div className="flex items-center justify-between gap-4">
										<div className="flex items-start gap-4">
											<div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-lg flex items-center justify-center">
												<span className="text-cyan-600 font-semibold text-sm">
													{index + 1}
												</span>
											</div>
											<h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
												{item.question}
											</h3>
										</div>
										<div className="flex-shrink-0">
											{openItems[index] ? (
												<ChevronDown className="h-5 w-5 text-cyan-600 transition-transform" />
											) : (
												<ChevronRight className="h-5 w-5 text-gray-400 transition-transform" />
											)}
										</div>
									</div>
								</CollapsibleTrigger>
								<CollapsibleContent className="px-6 pb-6">
									<div className="ml-12 space-y-3">
										{Array.isArray(item.answer) ? (
											<ul className="space-y-2">
												{item.answer.map(
													(point, pointIndex) => (
														<li
															key={pointIndex}
															className="flex items-start gap-3 text-gray-700"
														>
															<div className="flex-shrink-0 w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
															<span className="leading-relaxed">
																{point}
															</span>
														</li>
													)
												)}
											</ul>
										) : (
											<p className="text-gray-700 leading-relaxed">
												{item.answer}
											</p>
										)}
									</div>
								</CollapsibleContent>
							</Collapsible>
						</Card>
					))}
				</div>

				{/* Footer Notice */}
				<div className="mt-12 text-center">
					<p className="text-sm text-gray-500 italic">
						Cần hỗ trợ thêm? Liên hệ với chúng tôi qua Hotline:
						1900-xxxx hoặc Email: support@gshop.vn
					</p>
				</div>
			</div>
		</div>
	);
};

export default FAQ;
