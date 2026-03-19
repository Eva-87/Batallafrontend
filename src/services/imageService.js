const CLOUD_NAME = "mariamar";
const UPLOAD_PRESET = "batalla_quiz";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  console.log("Subiendo imagen a Cloudinary...");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  console.log("Respuesta Cloudinary:", data);

  if (!res.ok) throw new Error(data.error?.message || "Error subiendo imagen");

  return data.secure_url;
};
