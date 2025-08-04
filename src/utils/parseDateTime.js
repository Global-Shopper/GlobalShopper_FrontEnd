export const parseDateTime = (milisecond) => {
  return `${new Date(Number(milisecond)).toLocaleDateString("vi-VN")} - ${new Date(Number(milisecond)).toLocaleTimeString(["vi-VN"], { hour: "2-digit", minute: "2-digit" })}`
}
// Helper function to format date
export const formatDate = (dateString) => {
	const date = new Date(parseInt(dateString));
	const timeStr = date.toLocaleTimeString("vi-VN", {
		hour: "2-digit",
		minute: "2-digit",
	});
	const dateStr = date.toLocaleDateString("vi-VN", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
	return `${timeStr} | ${dateStr}`;
};
