
// Helper function to get request type text
export const getRequestTypeText = (type) => {
	switch (type) {
		case "ONLINE":
			return "Hàng từ nền tảng e-commerce";
		case "OFFLINE":
			return "Hàng nội địa quốc tế";
		default:
			return type;
	}
};
