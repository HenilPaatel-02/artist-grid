import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

import { SelectedImage } from "../image-picker.types";

type UseImagePickerReturn = {
  selectedImage: SelectedImage | null;
  isLoading: boolean;
  error: string | null;
  pickImage: () => Promise<SelectedImage | null>;
  clearImage: () => void;
};

export function useImagePicker(): UseImagePickerReturn {
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const pickImage = async (): Promise<SelectedImage | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled) {
        return null;
      }

      const asset = result.assets[0];

      if (!asset) {
        setError("Unable to load the selected image.");
        return null;
      }

      const image: SelectedImage = {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        fileName: asset.fileName ?? null,
        mimeType: asset.mimeType ?? null,
      };

      setSelectedImage(image);

      return image;
    } catch {
      setError("Unable to open the image gallery. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setError(null);
  };

  return {
    selectedImage,
    isLoading,
    error,
    pickImage,
    clearImage,
  };
}
