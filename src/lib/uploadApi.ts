import apiClient from "@/lib/apiClient";

// ============================================
// Types & Interfaces
// ============================================

export interface UploadAvatarResponse {
    data: {
      avatarUrl: string;
      publicId: string;
    };
  }

export interface UploadLogoResponse {
  statusCode: number;
  message: string;
  data: {
    logoUrl: string;
    publicId: string;
  };
}

export interface UploadImagesResponse {
  statusCode: number;
  message: string;
  data: { url: string; publicId: string }[];
}

export interface DeleteImageResponse {
  statusCode: number;
  message: string;
}

export interface DeleteMultipleImagesResponse {
  statusCode: number;
  message: string;
}

// ============================================
// API Functions
// ============================================

export const uploadApi = {
  /**
   * Upload user avatar
   * Accepts a single image file (max 5MB, jpg/jpeg/png/gif/webp)
   */
  uploadAvatar: async (file: File): Promise<UploadAvatarResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post("/upload/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  /**
   * Upload organization logo
   * Accepts a single image file (max 5MB, jpg/jpeg/png/gif/webp)
   */
  uploadOrganizationLogo: async (file: File): Promise<UploadLogoResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post(
      "/upload/organization-logo",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },

  /**
   * Upload multiple organization images (facility photos etc.)
   * Accepts up to 10 files, 5MB each
   */
  uploadImages: async (
    files: File[],
    folder?: string,
  ): Promise<UploadImagesResponse> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    if (folder) formData.append("folder", folder);
    const response = await apiClient.post("/upload/images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  /**
   * Delete a single image by its publicId
   */
  deleteImage: async (publicId: string): Promise<DeleteImageResponse> => {
    const response = await apiClient.post("/upload/delete", { publicId });
    return response.data;
  },

  /**
   * Delete multiple images by their publicIds
   */
  deleteMultipleImages: async (
    publicIds: string[],
  ): Promise<DeleteMultipleImagesResponse> => {
    const response = await apiClient.post("/upload/delete-multiple", {
      publicIds,
    });
    return response.data;
  },
};