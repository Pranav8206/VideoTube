import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadeOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // if file upload successfully
    console.log("localFilePath", localFilePath);

    console.log(response.url);

     fs.unlink(localFilePath, (err) => {
      if (err) throw err;
      console.log("path/file.txt was deleted");
    });

    return response.url;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove locally saved temporary
    // file as upload operation got failed
    return null;
  }
};

console.log(uploadeOnCloudinary, "printing the function uploadeOnCloudinary");

export { uploadeOnCloudinary };
