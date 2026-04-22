import { useState } from "react";
import { uploadApi } from "@/lib/uploadApi";
import { AxiosError } from "axios";

interface UseUploadReturn {
  // Avatar
  uploadAvatar: (file: File) => Promise<string | null>;
  uploadingAvatar: boolean;
  avatarError: string | null;

  // Org logo
  uploadLogo: (file: File) => Promise<string | null>;
  uploadingLogo: boolean;
  logoError: string | null;

  // Org facility images
  uploadImages: (
    files: File[],
  ) => Promise<{ url: string; publicId: string }[] | null>;
  uploadingImages: boolean;
  imagesError: string | null;

  // Delete
  deleteImage: (publicId: string) => Promise<boolean>;
  deleteMultipleImages: (publicIds: string[]) => Promise<boolean>;
  deleting: boolean;
  deleteError: string | null;

  // Shared
  resetErrors: () => void;
}

export function useUpload(): UseUploadReturn {
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);

  const [uploadingImages, setUploadingImages] = useState(false);
  const [imagesError, setImagesError] = useState<string | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  /**
   * Upload user avatar and patch userData.user.avatarUrl in localStorage
   * Returns the new URL on success, null on failure
   */
  const uploadAvatar = async (file: File): Promise<string | null> => {
    setUploadingAvatar(true);
    setAvatarError(null);

    try {
      const response = await uploadApi.uploadAvatar(file);
      const newUrl = response.data.avatarUrl;

      // Patch avatarUrl in localStorage so the rest of the app reflects it immediately
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("userData");
        if (stored) {
          const userData = JSON.parse(stored);
          userData.user.avatarUrl = newUrl;
          localStorage.setItem("userData", JSON.stringify(userData));
        }
      }

      return newUrl;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setAvatarError(
        axiosError.response?.data?.message ?? "Failed to upload avatar.",
      );
      return null;
    } finally {
      setUploadingAvatar(false);
    }
  };

  /**
   * Upload org logo and patch currentOrg.logoUrl in localStorage
   * Returns the new URL on success, null on failure
   */
  const uploadLogo = async (file: File): Promise<string | null> => {
    setUploadingLogo(true);
    setLogoError(null);

    try {
      const response = await uploadApi.uploadOrganizationLogo(file);
      console.log("uploadLogo response:", response);
      const newUrl = response.data.logoUrl;

      // Patch logoUrl in currentOrg
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("currentOrg");
        if (stored) {
          const currentOrg = JSON.parse(stored);
          currentOrg.logoUrl = newUrl;
          localStorage.setItem("currentOrg", JSON.stringify(currentOrg));
        }

        // Also patch the matching org inside userData.organizations
        // so if the user goes back to select-org it shows the updated logo
        const userData = localStorage.getItem("userData");
        if (userData) {
          const parsed = JSON.parse(userData);
          const orgId = JSON.parse(
            localStorage.getItem("currentOrg") ?? "{}",
          )?.id;
          if (orgId && parsed.organizations) {
            parsed.organizations = parsed.organizations.map((o: any) =>
              o.id === orgId ? { ...o, logoUrl: newUrl } : o,
            );
            localStorage.setItem("userData", JSON.stringify(parsed));
          }
        }
      }

      return newUrl;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setLogoError(
        axiosError.response?.data?.message ?? "Failed to upload logo.",
      );
      return null;
    } finally {
      setUploadingLogo(false);
    }
  };

  /**
   * Upload multiple facility images
   * Returns array of { url, publicId } on success so the UI can store publicIds for deletion later
   */
  const uploadImages = async (
    files: File[],
  ): Promise<{ url: string; publicId: string }[] | null> => {
    setUploadingImages(true);
    setImagesError(null);

    try {
      const response = await uploadApi.uploadImages(files);
      console.log("uploadImages response:", response);
      return response.data.map((img: { url: string; publicId: string }) => ({
        url: img.url,
        publicId: img.publicId,
      }));
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setImagesError(
        axiosError.response?.data?.message ?? "Failed to upload images.",
      );
      return null;
    } finally {
      setUploadingImages(false);
    }
  };

  /**
   * Delete a single image by publicId
   */
  const deleteImage = async (publicId: string): Promise<boolean> => {
    setDeleting(true);
    setDeleteError(null);

    try {
      await uploadApi.deleteImage(publicId);
      return true;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setDeleteError(
        axiosError.response?.data?.message ?? "Failed to delete image.",
      );
      return false;
    } finally {
      setDeleting(false);
    }
  };

  /**
   * Delete multiple images by publicIds
   */
  const deleteMultipleImages = async (
    publicIds: string[],
  ): Promise<boolean> => {
    setDeleting(true);
    setDeleteError(null);

    try {
      await uploadApi.deleteMultipleImages(publicIds);
      return true;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setDeleteError(
        axiosError.response?.data?.message ?? "Failed to delete images.",
      );
      return false;
    } finally {
      setDeleting(false);
    }
  };

  const resetErrors = () => {
    setAvatarError(null);
    setLogoError(null);
    setImagesError(null);
    setDeleteError(null);
  };

  return {
    uploadAvatar,
    uploadingAvatar,
    avatarError,
    uploadLogo,
    uploadingLogo,
    logoError,
    uploadImages,
    uploadingImages,
    imagesError,
    deleteImage,
    deleteMultipleImages,
    deleting,
    deleteError,
    resetErrors,
  };
}
