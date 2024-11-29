import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { supabase } from "./lib/supabase";
import { decode as atob } from "base64-arraybuffer";
import { useSelector , useDispatch } from "react-redux";
import { setProfileImgLink } from "./features/profileSlice";
import uuid from 'react-native-uuid';

export const getPublicImageUrl = (storageName, sessionData , postId) =>{
  const fileName = storageName === "profile images" ? `${sessionData?.session.user.id}.jpg` : `${postId}.jpg`;
  const { data, error } = supabase
    .storage
    .from(storageName)
    .getPublicUrl(fileName);

  if (error) {
    console.error('Error fetching public URL:', error);
    return null;
  }
  const timestamp = new Date().getTime();
  return `${data?.publicUrl}?cache_buster=${timestamp}`;
}

export const addImage = async(sessionData, storageName, dispatch, setProfileImgLink, selectedImage) => {
  try {
    let _image;
    if (storageName === "posts-images") {
      if (!selectedImage) {
        console.error("Selected image data is required for posts-images.");
        return;
      }
      _image = selectedImage; // Use the already selected image data
    } else {
      // Launch image picker for other storage types
      _image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true, // Enables base64 encoding
      });

      if (_image.canceled) {
        console.warn("Image picker was canceled.");
        return;
      }
    }
    // Import the Image compression API
    const { Image: ImageCompressor } = require("react-native-compressor");

    // Compress the selected image
    const compressedUri = await ImageCompressor.compress(
      _image,
      {
        compressionMethod: "auto", // Use 'manual' for more control
        maxWidth: 1000, // Adjust maxWidth for resized dimensions
        quality: 0.7, // Quality of the compression (0.7 = 70%)
      }
    );

    // Read compressed image and convert it to Base64
    const compressedBase64 = await FileSystem.readAsStringAsync(
      compressedUri,
      {
        encoding: FileSystem.EncodingType.Base64,
      }
    );
    console.warn("Image compressed successfully !!");
    const postId = uuid.v4().toString();

    // Upload the compressed Base64 image
    const uploadedUrl = await uploadImageAsArrayBuffer(
      compressedBase64,
      storageName,
      sessionData,
      postId
    );
    console.warn("uploaded Url", uploadedUrl);

    if (storageName === "profile images") {
      dispatch(setProfileImgLink(uploadedUrl));
    } else {
      //
    }
  } catch (error) {
    console.error("Error during image selection or compression:", error);
  }
};


// Function to convert base64 to ArrayBuffer and upload
const uploadImageAsArrayBuffer = async (
  base64Data,
  storageName,
  sessionData,
  postId
) => {
  try {
    // Decode Base64 data to binary data
    const binaryString = atob(base64Data);
    const fileName = storageName === "profile images" ? `${sessionData?.session.user.id}.jpg` : `${postId}.jpg`;
    const { data, error } = await supabase.storage
      .from(storageName)
      .upload(fileName, binaryString, {
        cacheControl: "3600",
        upsert: true,
        contentType: "image/jpeg",
      });

    if (error) {
      console.error("Error uploading image:", error);
      return null;
    } 
    return getPublicImageUrl(storageName, sessionData , postId);

  } catch (error) {
    console.error("Unexpected error during image upload:", error);
    return null;
  }
};