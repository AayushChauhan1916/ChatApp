const Url = `https://api.cloudinary.com/v1_1/${
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
}/auto/upload`;

const uploadImage = async (file) => {
  
  try {
    const formData = new FormData();
    formData.append("file",file);
    formData.append("upload_preset","Chat-App");

    const response = await fetch(Url, {
      method: "POST",
      body: formData,
    });

    

    const data = await response.json();
    
    return data;
  } catch (err) {
    console.log(err);
  }
};

export default uploadImage;
