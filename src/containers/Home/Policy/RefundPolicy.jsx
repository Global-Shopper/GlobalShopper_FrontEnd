import React from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import {
	RefreshCw,
	DollarSign,
	Shield,
	AlertCircle,
	Clock,
	FileCheck,
	UserX,
	Handshake,
	Phone,
} from "lucide-react";

const RefundPolicy = () => {
	const sections = [
		{
			id: 1,
			icon: FileCheck,
			title: "Giới thiệu",
			content:
				"Chính sách hoàn tiền của GShop được xây dựng nhằm bảo vệ quyền lợi của khách hàng. Mọi trường hợp hoàn tiền có thể được xử lý qua Ví GShop hoặc theo phương thức thanh toán ban đầu (tùy tình huống).",
		},
		{
			id: 2,
			icon: DollarSign,
			title: "Trường hợp được hoàn tiền 100%",
			items: [
				"Sản phẩm không còn hàng hoặc nhà cung cấp hủy đơn.",
				"Phát sinh lỗi hệ thống, lỗi thanh toán (không thuộc về khách hàng).",
				"Đặt nhầm sản phẩm/sai mã/sai loại từ GShop hoặc nhà cung cấp.",
			],
			note: "Tiền sẽ hoàn vào Ví GShop trong 24–48 giờ làm việc sau khi xác minh.",
		},
		{
			id: 3,
			icon: Shield,
			title: "Theo chính sách sàn TMĐT",
			content:
				"Trường hợp sản phẩm không đúng mô tả hoặc không giống yêu cầu ban đầu:",
			items: [
				"Cung cấp video mở hộp (unboxing) và thông tin đơn hàng.",
				"Đối chiếu với chính sách của sàn (Amazon, Taobao, Rakuten, …).",
				"Mức hoàn có thể 100% hoặc một phần, tùy quy định sàn.",
			],
		},
		{
			id: 4,
			icon: UserX,
			title: "Trường hợp không được hoàn tiền",
			items: [
				"Đổi ý hoặc không muốn nhận hàng sau khi đã mua và vận chuyển.",
				"Thất lạc do đơn vị vận chuyển quốc tế (trừ khi có bảo hiểm GShop).",
				"Không cung cấp bằng chứng hợp lệ theo yêu cầu khiếu nại.",
				"Cố tình gian lận hoặc khai báo sai sự thật.",
			],
		},
		{
			id: 5,
			icon: RefreshCw,
			title: "Quy trình yêu cầu hoàn tiền",
			steps: [
				"Gửi yêu cầu trong ứng dụng/web GShop (mã đơn, lý do, bằng chứng).",
				"Xác minh thông tin, phân loại lỗi.",
				"Thông báo kết quả trong vòng 48 giờ.",
				"Hoàn tiền về Ví GShop hoặc theo phương thức thanh toán ban đầu.",
			],
		},
		{
			id: 6,
			icon: Clock,
			title: "Thời gian xử lý",
			items: [
				"24–48 giờ làm việc: Hoàn về Ví GShop.",
				"3–7 ngày làm việc: Hoàn qua ngân hàng hoặc VNPay (phụ thuộc ngân hàng).",
			],
		},
		{
			id: 7,
			icon: AlertCircle,
			title: "Biện pháp chống gian lận",
			items: [
				"Tạm khóa tài khoản nếu phát hiện khiếu nại sai sự thật.",
				"Theo dõi tài khoản có nhiều khiếu nại bất thường.",
				"Từ chối hoàn tiền với các trường hợp vi phạm.",
			],
		},
		{
			id: 8,
			icon: Handshake,
			title: "Cam kết minh bạch",
			items: [
				"Ưu tiên quyền lợi khách hàng chính đáng.",
				"Quy trình minh bạch, theo dõi trực tiếp trên ứng dụng.",
				"Thay đổi chính sách (nếu có) sẽ thông báo qua email và cập nhật trên website/app.",
			],
		},
	];

	return (
		<div className="min-h-screen bg-white">
			<div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-4xl">
				{/* Header Section */}
				<div className="text-center mb-12">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg mb-6">
						<RefreshCw className="h-8 w-8 text-white" />
					</div>
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Chính sách hoàn tiền GShop
					</h1>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
						Minh bạch, nhanh chóng và bảo vệ quyền lợi khách hàng
						trong mọi giao dịch. Cam kết mang đến sự an tâm tuyệt
						đối cho khách hàng.
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
										<div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl">
											<section.icon className="h-6 w-6 text-emerald-600" />
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
															<div className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
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
															<div className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white text-xs font-semibold rounded-full flex items-center justify-center mt-0.5">
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
											<div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
												<p className="text-emerald-800 text-sm font-medium">
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

export default RefundPolicy;
