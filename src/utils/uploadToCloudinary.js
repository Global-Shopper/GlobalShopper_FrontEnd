import { CLOUDINARY_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/const/urlconst";
import axios from "axios";

export const uploadToCloudinary = async (file, resourceType = "image") => {
  console.log("CLOUDINARY_UPLOAD_PRESET: ", CLOUDINARY_UPLOAD_PRESET);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET); // Tạo trong Cloudinary
  formData.append("cloud_name", CLOUDINARY_NAME);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/${resourceType}/upload`,
      formData
    );
    const url = response?.data?.secure_url || response?.data?.url;
    console.log("Cloudinary uploaded URL: ", url);
    return url;
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
};
