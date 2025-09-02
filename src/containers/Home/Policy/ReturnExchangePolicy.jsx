import React from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import {
	ArrowLeftRight,
	Info,
	CheckCircle,
	XCircle,
	ClipboardList,
	DollarSign,
	CreditCard,
	Handshake,
} from "lucide-react";

const ReturnExchangePolicy = () => {
	const sections = [
		{
			id: 1,
			icon: Info,
			title: "Giới thiệu",
			content:
				"Chính sách đổi/hoàn trả của GShop được xây dựng nhằm bảo vệ quyền lợi khách hàng khi nhận sản phẩm không đúng mong đợi.",
		},
		{
			id: 2,
			icon: CheckCircle,
			title: "Điều kiện áp dụng",
			items: [
				"Sai loại, mẫu mã, kích thước, màu sắc so với yêu cầu.",
				"Hư hỏng, bể vỡ, trầy xước nghiêm trọng khi vận chuyển (cần video/ảnh mở hộp).",
				"Lỗi sản xuất hoặc lỗi từ nhà cung cấp.",
				"Không giống mô tả hoặc thông tin đã xác nhận trước đó.",
			],
			note: "Gửi yêu cầu trong vòng 48 giờ kể từ khi nhận hàng và kèm đầy đủ bằng chứng.",
		},
		{
			id: 3,
			icon: XCircle,
			title: "Trường hợp không áp dụng",
			items: [
				"Sản phẩm đã sử dụng, giặt, tháo tem mác, không còn nguyên trạng.",
				"Đổi ý sau khi đơn đã mua và vận chuyển.",
				"Danh mục hạn chế (hàng dễ vỡ đặc biệt, thực phẩm, mỹ phẩm đã mở nắp, sản phẩm cá nhân hóa).",
				"Không cung cấp đủ bằng chứng hợp lệ hoặc khiếu nại quá 48 giờ.",
			],
		},
		{
			id: 4,
			icon: ClipboardList,
			title: "Quy trình xử lý",
			steps: [
				"Gửi yêu cầu trên ứng dụng/web GShop, chọn đơn hàng và cung cấp bằng chứng.",
				"Xác minh thông tin, phân loại lỗi (khách hàng/NCC/vận chuyển).",
				"Phương án: Đổi sản phẩm khác, trả hàng và hoàn tiền, hoặc hoàn một phần.",
				"Thời gian phản hồi: trong 48 giờ làm việc kể từ khi tiếp nhận yêu cầu.",
			],
		},
		{
			id: 5,
			icon: DollarSign,
			title: "Chi phí đổi/hoàn trả",
			items: [
				"Miễn phí nếu lỗi từ GShop, nhà cung cấp hoặc đơn vị vận chuyển.",
				"Khách hàng chịu phí nếu lý do cá nhân (không còn nhu cầu, đặt nhầm nhưng GShop đã mua đúng).",
				"Phí đổi trả sẽ được thông báo rõ ràng trước khi tiến hành.",
			],
		},
		{
			id: 6,
			icon: CreditCard,
			title: "Phương thức hoàn trả",
			items: [
				"Hoàn tiền vào Ví GShop (ưu tiên, nhanh nhất) hoặc theo phương thức thanh toán ban đầu.",
				"Thời gian hoàn tiền: 24–48 giờ (Ví GShop) hoặc 3–7 ngày (ngân hàng/VNPay).",
			],
		},
		{
			id: 7,
			icon: Handshake,
			title: "Cam kết dịch vụ",
			items: [
				"Đặt quyền lợi khách hàng lên hàng đầu.",
				"Xử lý minh bạch, có thể theo dõi trực tiếp trên ứng dụng.",
				"Chính sách có thể thay đổi theo quốc gia, nhà cung cấp hoặc đối tác vận chuyển.",
			],
		},
	];

	return (
		<div className="min-h-screen bg-white">
			<div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-4xl">
				{/* Header Section */}
				<div className="text-center mb-12">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl shadow-lg mb-6">
						<ArrowLeftRight className="h-8 w-8 text-white" />
					</div>
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Chính sách đổi/hoàn trả GShop
					</h1>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
						Minh bạch, công bằng và xử lý nhanh chóng mọi yêu cầu
						đổi hoặc trả hàng. Chúng tôi luôn đặt quyền lợi khách
						hàng lên hàng đầu.
					</p>
				</div>
				{/* Policy Sections */}
				<div className="space-y-8">
					{sections.map((section) => (
						<Card
							key={section.id}
							className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
						>
							<CardContent className="p-8">
								<div className="flex items-start gap-6">
									<div className="flex-shrink-0">
										<div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl">
											<section.icon className="h-6 w-6 text-orange-600" />
										</div>
									</div>
									<div className="flex-1 min-w-0">
										<h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
											{section.id}. {section.title}
										</h3>
										{section.content && (
											<p className="text-gray-700 leading-relaxed mb-4">
												{section.content}
											</p>
										)}
										{section.items && (
											<ul className="space-y-3">
												{section.items.map(
													(item, index) => (
														<li
															key={index}
															className="flex items-start gap-3 text-gray-700"
														>
															<div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
															<span className="leading-relaxed">
																{item}
															</span>
														</li>
													)
												)}
											</ul>
										)}
										{section.steps && (
											<ol className="space-y-3">
												{section.steps.map(
													(step, index) => (
														<li
															key={index}
															className="flex items-start gap-3 text-gray-700"
														>
															<div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white text-xs font-semibold rounded-full flex items-center justify-center mt-0.5">
																{index + 1}
															</div>
															<span className="leading-relaxed">
																{step}
															</span>
														</li>
													)
												)}
											</ol>
										)}
										{section.note && (
											<div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
												<p className="text-orange-800 text-sm font-medium">
													💡 {section.note}
												</p>
											</div>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Footer Notice */}
				<div className="mt-12 text-center">
					<p className="text-sm text-gray-500 italic">
						Chính sách có hiệu lực từ ngày 28/08/2025 • Cập nhật lần
						cuối: 28/08/2025
					</p>
				</div>
			</div>
		</div>
	);
};

export default ReturnExchangePolicy;
