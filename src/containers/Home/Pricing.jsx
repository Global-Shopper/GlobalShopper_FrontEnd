import React from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import {
	DollarSign,
	Info,
	Percent,
	Truck,
	Calculator,
	CheckCircle,
	Globe,
	Shield,
} from "lucide-react";

const Pricing = () => {
	const pricingSections = [
		{
			id: 1,
			icon: Info,
			title: "Giới thiệu chung",
			content:
				"Mọi báo giá mua hộ quốc tế được tính dựa trên giá sản phẩm gốc, phí dịch vụ cố định và phí vận chuyển quốc tế. GShop cam kết minh bạch, không phụ phí ẩn.",
		},
		{
			id: 2,
			icon: Percent,
			title: "Phí dịch vụ mua hộ",
			items: [
				"Phí dịch vụ hiện tại: 10% trên giá trị sản phẩm.",
				"Phí có thể được điều chỉnh theo cấu hình hệ thống trong tương lai.",
				"Áp dụng cho toàn bộ đơn hàng, không có phụ phí ẩn.",
			],
			benefits: [
				"Mua hàng quốc tế nhanh chóng, thuận tiện.",
				"Thanh toán quốc tế an toàn, bảo mật.",
				"Minh bạch chi phí, đảm bảo chất lượng sản phẩm.",
			],
		},
		{
			id: 3,
			icon: Truck,
			title: "Phí vận chuyển quốc tế",
			content:
				"Khách hàng có thể lựa chọn hãng vận chuyển phù hợp theo nhu cầu. Các đối tác phổ biến gồm FedEx, UPS, DHL, v.v.",
			notes: [
				"Chi phí phụ thuộc trọng lượng, kích thước, tuyến đường và điểm đến.",
				"Hệ thống báo giá hiển thị tổng chi phí dự kiến, đã bao gồm phí vận chuyển quốc tế ước tính.",
			],
		},
		{
			id: 4,
			icon: Calculator,
			title: "Công thức tính báo giá",
			formula:
				"Tổng chi phí = Giá sản phẩm + Thuế (nếu có) + Phí dịch vụ (10% giá sản phẩm) + Phí vận chuyển quốc tế",
			example: {
				productPrice: 100,
				tax: 0,
				serviceFee: 10,
				shippingFee: 25,
				total: 135,
			},
		},
	];

	return (
		<div className="min-h-screen bg-white">
			<div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-4xl">
				{/* Header Section */}
				<div className="text-center mb-12">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl shadow-lg mb-6">
						<DollarSign className="h-8 w-8 text-white" />
					</div>
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Bảng giá GShop
					</h1>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
						Thông tin minh bạch về phí dịch vụ, phí vận chuyển quốc
						tế và công thức tính tổng chi phí. Không có phí ẩn, mọi
						thứ đều rõ ràng và công khai.
					</p>
				</div>

				{/* Pricing Sections */}
				<div className="space-y-8">
					{pricingSections.map((section) => (
						<Card
							key={section.id}
							className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
						>
							<CardContent className="p-8">
								<div className="flex items-start gap-6">
									<div className="flex-shrink-0">
										<div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-100 to-teal-100 rounded-xl">
											<section.icon className="h-6 w-6 text-green-600" />
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
											<ul className="space-y-3 mb-4">
												{section.items.map(
													(item, index) => (
														<li
															key={index}
															className="flex items-start gap-3 text-gray-700"
														>
															<div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
															<span
																className="leading-relaxed"
																dangerouslySetInnerHTML={{
																	__html: item,
																}}
															></span>
														</li>
													)
												)}
											</ul>
										)}

										{section.benefits && (
											<div className="mt-4 p-6 bg-green-50 border border-green-200 rounded-lg">
												<div className="flex items-center gap-2 mb-3">
													<CheckCircle className="h-5 w-5 text-green-600" />
													<p className="font-semibold text-green-800">
														Lợi ích khi sử dụng dịch
														vụ:
													</p>
												</div>
												<ul className="space-y-2">
													{section.benefits.map(
														(benefit, index) => (
															<li
																key={index}
																className="flex items-start gap-3 text-green-700"
															>
																<div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
																<span className="leading-relaxed">
																	{benefit}
																</span>
															</li>
														)
													)}
												</ul>
											</div>
										)}

										{section.notes && (
											<div className="mt-4 p-6 bg-blue-50 border border-blue-200 rounded-lg">
												<div className="flex items-center gap-2 mb-3">
													<Info className="h-5 w-5 text-blue-600" />
													<p className="font-semibold text-blue-800">
														Lưu ý:
													</p>
												</div>
												<ul className="space-y-2">
													{section.notes.map(
														(note, index) => (
															<li
																key={index}
																className="flex items-start gap-3 text-blue-700"
															>
																<div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
																<span className="leading-relaxed">
																	{note}
																</span>
															</li>
														)
													)}
												</ul>
											</div>
										)}

										{section.formula && (
											<div className="space-y-4">
												<div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
													<p className="text-gray-800 font-medium leading-relaxed">
														{section.formula}
													</p>
												</div>

												<div className="p-6 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg">
													<div className="flex items-center gap-2 mb-4">
														<Calculator className="h-5 w-5 text-green-600" />
														<p className="font-semibold text-green-800">
															Ví dụ minh họa
														</p>
													</div>
													<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
														<div className="space-y-3">
															<div className="flex justify-between items-center">
																<span className="text-gray-700">
																	Giá sản
																	phẩm:
																</span>
																<span className="font-semibold text-gray-900">
																	{
																		section
																			.example
																			.productPrice
																	}{" "}
																	USD
																</span>
															</div>
															<div className="flex justify-between items-center">
																<span className="text-gray-700">
																	Thuế:
																</span>
																<span className="font-semibold text-gray-900">
																	{
																		section
																			.example
																			.tax
																	}{" "}
																	USD
																</span>
															</div>
															<div className="flex justify-between items-center">
																<span className="text-gray-700">
																	Phí dịch vụ
																	(10%):
																</span>
																<span className="font-semibold text-gray-900">
																	{
																		section
																			.example
																			.serviceFee
																	}{" "}
																	USD
																</span>
															</div>
															<div className="flex justify-between items-center">
																<span className="text-gray-700">
																	Phí vận
																	chuyển quốc
																	tế:
																</span>
																<span className="font-semibold text-gray-900">
																	{
																		section
																			.example
																			.shippingFee
																	}{" "}
																	USD
																</span>
															</div>
														</div>
														<div className="flex items-center justify-center">
															<div className="p-4 bg-white rounded-lg shadow-sm border-2 border-green-300">
																<div className="text-center">
																	<p className="text-sm text-gray-600 mb-1">
																		Tổng
																		cộng
																	</p>
																	<p className="text-3xl font-bold text-green-600">
																		{
																			section
																				.example
																				.total
																		}{" "}
																		USD
																	</p>
																</div>
															</div>
														</div>
													</div>
												</div>
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
						Bảng giá có hiệu lực từ ngày 28/08/2025 • Cập nhật lần
						cuối: 28/08/2025
					</p>
				</div>
			</div>
		</div>
	);
};

export default Pricing;
