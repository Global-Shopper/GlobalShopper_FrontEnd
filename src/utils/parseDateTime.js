export const parseDateTime = (milisecond) => {
  return `${new Date(Number(milisecond)).toLocaleDateString("vi-VN")} - ${new Date(Number(milisecond)).toLocaleTimeString(["vi-VN"], { hour: "2-digit", minute: "2-digit" })}`
}