import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import {
	MapPin,
	Phone,
	Mail,
	MessageCircle,
	Send,
	Building2,
	Clock,
	User,
	PhoneCall,
} from "lucide-react";

const ContactPage = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
			<div className="max-w-7xl mx-auto py-16 px-6 lg:px-20">
				{/* Header Section */}
				<div className="text-center mb-16">
					<div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-6">
						<MessageCircle className="h-10 w-10 text-white" />
					</div>
					<h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
						Liên hệ với chúng tôi
					</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Chúng tôi luôn sẵn sàng hỗ trợ bạn với dịch vụ mua hộ
						hàng quốc tế tốt nhất
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
					{/* Left: Contact Info */}
					<div className="space-y-8">
						{/* Office Info Card */}
						<Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
							<CardContent className="p-8">
								<div className="flex items-center gap-4 mb-6">
									<div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md">
										<Building2 className="h-6 w-6 text-white" />
									</div>
									<h3 className="text-2xl font-bold text-gray-900">
										Văn phòng giao dịch
									</h3>
								</div>
								<div className="space-y-4">
									<div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
										<MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
										<div>
											<p className="font-semibold text-gray-900 mb-1">
												Địa chỉ
											</p>
											<p className="text-gray-600">
												7 Đ. D1, Long Thạnh Mỹ, Thủ Đức,
												Hồ Chí Minh 700000
											</p>
										</div>
									</div>

									<div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
										<Clock className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
										<div>
											<p className="font-semibold text-gray-900 mb-1">
												Giờ làm việc
											</p>
											<p className="text-gray-600">
												Thứ 2 - Thứ 6: 8:00 - 18:00
											</p>
											<p className="text-gray-600">
												Thứ 7: 8:00 - 12:00
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Contact Methods */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							<Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-sky-50 hover:shadow-xl transition-all duration-300 group">
								<CardContent className="p-6 text-center">
									<div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-sky-500 rounded-xl shadow-md mb-4 group-hover:scale-110 transition-transform">
										<Phone className="h-7 w-7 text-white" />
									</div>
									<h4 className="font-bold text-gray-900 mb-2">
										Hotline
									</h4>
									<p className="text-lg font-semibold text-blue-600">
										0123 456 789
									</p>
									<p className="text-sm text-gray-600 mt-2">
										24/7 hỗ trợ
									</p>
								</CardContent>
							</Card>

							<Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-xl transition-all duration-300 group">
								<CardContent className="p-6 text-center">
									<div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-md mb-4 group-hover:scale-110 transition-transform">
										<Mail className="h-7 w-7 text-white" />
									</div>
									<h4 className="font-bold text-gray-900 mb-2">
										Email
									</h4>
									<p className="text-lg font-semibold text-amber-600">
										sep490gshop@gmail.com
									</p>
									<p className="text-sm text-gray-600 mt-2">
										Phản hồi trong 24h
									</p>
								</CardContent>
							</Card>
						</div>

						<div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 shadow-sm">
							<h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center gap-2">
								💡 Lời nhắn từ chúng tôi
							</h3>
							<p className="text-gray-700 leading-relaxed">
								Bạn có thể để lại thông tin và chúng tôi sẽ liên
								hệ để hỗ trợ ngay lập tức. Đội ngũ chuyên gia
								của chúng tôi luôn sẵn sàng tư vấn miễn phí!
							</p>
						</div>
					</div>

					{/* Right: Contact Form */}
					<Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm sticky top-8">
						<CardContent className="p-8">
							<div className="text-center mb-8">
								<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-lg mb-4">
									<Send className="h-8 w-8 text-white" />
								</div>
								<h3 className="text-2xl font-bold text-gray-900 mb-2">
									Gửi tin nhắn cho chúng tôi
								</h3>
								<p className="text-gray-600">
									Điền thông tin bên dưới và chúng tôi sẽ liên
									hệ sớm nhất
								</p>
							</div>
							<Formik
								initialValues={{
									fullName: "",
									phone: "",
									content: "",
								}}
								validationSchema={Yup.object({
									fullName: Yup.string()
										.trim()
										.required("Vui lòng nhập họ và tên"),
									phone: Yup.string()
										.matches(
											/^(0|\+84)\d{9,10}$/,
											"Số điện thoại không hợp lệ"
										)
										.required(
											"Vui lòng nhập số điện thoại"
										),
									content: Yup.string()
										.trim()
										.required("Vui lòng nhập nội dung"),
								})}
								onSubmit={(
									values,
									{ resetForm, setSubmitting }
								) => {
									setTimeout(() => {
										toast.success(
											"Đã gửi liên hệ thành công! 🎉",
											{
												description:
													"Chúng tôi sẽ phản hồi trong vòng 24 giờ.",
											}
										);
										resetForm();
										setSubmitting(false);
									}, 400);
								}}
							>
								{({ errors, touched, isSubmitting }) => (
									<Form className="space-y-6">
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
											<div className="relative">
												<div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
													<User className="h-5 w-5" />
												</div>
												<Field
													as={Input}
													name="fullName"
													placeholder="Họ và tên"
													className={`pl-12 h-12 border-2 focus:border-blue-500 rounded-xl ${
														touched.fullName &&
														errors.fullName
															? "border-red-300"
															: "border-gray-200"
													}`}
													aria-invalid={
														touched.fullName &&
														errors.fullName
															? true
															: undefined
													}
												/>
												<ErrorMessage name="fullName">
													{(msg) => (
														<p className="mt-2 text-sm text-red-600 flex items-center gap-1">
															<span className="text-red-500">
																⚠
															</span>
															{msg}
														</p>
													)}
												</ErrorMessage>
											</div>

											<div className="relative">
												<div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
													<PhoneCall className="h-5 w-5" />
												</div>
												<Field
													as={Input}
													name="phone"
													placeholder="Số điện thoại"
													inputMode="tel"
													className={`pl-12 h-12 border-2 focus:border-blue-500 rounded-xl ${
														touched.phone &&
														errors.phone
															? "border-red-300"
															: "border-gray-200"
													}`}
													aria-invalid={
														touched.phone &&
														errors.phone
															? true
															: undefined
													}
												/>
												<ErrorMessage name="phone">
													{(msg) => (
														<p className="mt-2 text-sm text-red-600 flex items-center gap-1">
															<span className="text-red-500">
																⚠
															</span>
															{msg}
														</p>
													)}
												</ErrorMessage>
											</div>
										</div>

										<div className="relative">
											<div className="absolute left-3 top-4 text-gray-400">
												<MessageCircle className="h-5 w-5" />
											</div>
											<Field
												as={Textarea}
												name="content"
												placeholder="Nhập nội dung tin nhắn của bạn..."
												rows={6}
												className={`pl-12 pt-4 border-2 focus:border-blue-500 rounded-xl resize-none ${
													touched.content &&
													errors.content
														? "border-red-300"
														: "border-gray-200"
												}`}
												aria-invalid={
													touched.content &&
													errors.content
														? true
														: undefined
												}
											/>
											<ErrorMessage name="content">
												{(msg) => (
													<p className="mt-2 text-sm text-red-600 flex items-center gap-1">
														<span className="text-red-500">
															⚠
														</span>
														{msg}
													</p>
												)}
											</ErrorMessage>
										</div>

										<div className="pt-4">
											<Button
												type="submit"
												disabled={isSubmitting}
												className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
											>
												{isSubmitting ? (
													<div className="flex items-center gap-3">
														<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
														Đang gửi...
													</div>
												) : (
													<div className="flex items-center gap-3">
														<Send className="h-5 w-5" />
														Gửi tin nhắn
													</div>
												)}
											</Button>
										</div>
									</Form>
								)}
							</Formik>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default ContactPage;
