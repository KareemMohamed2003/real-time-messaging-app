import { v2 as cloudinary } from "cloudinary";
// Configuration
cloudinary.config({
  cloud_name: "dsmcekoq5",
  api_key: "286412355627297",
  api_secret: "b9QwteZoLb0j-K_PDEtmgzv8uV0", // Click 'View API Keys' above to copy your API secret
});
// console.log("cloudinary config", cloudinary.config());

export const deleteCloudinaryImage = async (id: string) => {
  const assetToDelete = await cloudinary.uploader.destroy(id, {
    resource_type: "image",
  });
  if (assetToDelete.result !== "ok") {
    console.log("failed to delete image");
    throw new Error("Deletion failed: " + assetToDelete.result);
  }
};
export default cloudinary;

// Cloud name	 dsmcekoq5
// API key	 : 286412355627297
// API secret	 : b9QwteZoLb0j-K_PDEtmgzv8uV0
// API environment vasriable
// CLOUDINARY_URL=cloudinary://286412355627297:b9QwteZoLb0j-K_PDEtmgzv8uV0@dsmcekoq5
