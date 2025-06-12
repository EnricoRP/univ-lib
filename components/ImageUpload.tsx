"use client";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitProvider,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
  Image,
} from "@imagekit/next";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Button } from "./ui/button";
import NextImage from "next/image";
import { cn } from "@/lib/utils";
import config from "@/lib/config";

export interface ImageUploadRef {
  handleUpload: () => Promise<void>;
}

interface Props {  
  placeholder: string;
  folder: string; 
  onFileChange: (filePath: string) => void; 
}

const ImageUpload = forwardRef<ImageUploadRef, Props>(
  (
    {  placeholder, folder, onFileChange },ref
    
  ) => {
    // state to keep track of the current upload progres in percentage
    const [progress, setProgress] = useState(0);
    // create a ref for the file input element to access its files easily
    const fileInputRef = useRef<HTMLInputElement>(null);
    // for preview url / pre upload
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    // save url for showing image.
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    // create an AbortController instance to provide an option to cancel the upload if needed.
    const abortController = new AbortController();

    /**
     * Authenticates and retrieves the necessary upload credentials from the server.
     *
     * This function calls the authentication API endpoint to receive upload parameters like signature,
     * expire time, token, and publicKey.
     *
     * @returns {Promise<{signature: string, expire: string, token: string, publicKey: string}>} The authentication parameters.
     * @throws {Error} Throws an error if the authentication request fails.
     */
    const authenticator = async () => {
      try {
        const respone = await fetch(`/api/upload-auth`);
        if (!respone.ok) {
          // if the server respone is not successful, extract the error text for debugging.
          const errorText = await respone.text();
          throw new Error(
            `Request failed with status ${respone.status}: ${errorText}`
          );
        }
        // parse and destructure the respone JSON for upload credentials.
        const data = await respone.json();
        const { signature, expire, token, publicKey } = data;
        return { signature, expire, token, publicKey };
      } catch (error: unknown) {
        // log the original error for debugging before rethrowing a new error.
        console.error("Auth error: ", error);
        throw new Error("Auth request failed");
      }
    };

    const handleFileChange = () => {
      const fileInput = fileInputRef.current;
      if (fileInput?.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        setPreviewUrl(URL.createObjectURL(file)); 
        onFileChange(URL.createObjectURL(file)); 
      }
    };

    const handleUpload = async () => {
      // Access the file input element using the ref
      const fileInput = fileInputRef.current;
      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        alert("Please select a file to upload");
        return;
      }

      // Extract the first file from the file input
      const file = fileInput.files[0];

      // Retrieve authentication parameters for the upload.
      let authParams;
      try {
        authParams = await authenticator();
      } catch (authError) {
        console.error("Failed to authenticate for upload:", authError);
        return;
      }
      const { signature, expire, token, publicKey } = authParams;

      // Call the ImageKit SDK upload function with the required parameters and callbacks.
      try {
        const uploadResponse = await upload({
          // Authentication parameters
          expire,
          token,
          signature,
          publicKey,
          file,
          fileName: file.name,
          folder: folder,
          // Progress callback to update upload progress state
          onProgress: (event) => {
            setProgress((event.loaded / event.total) * 100);
          },
          // Abort signal to allow cancellation of the upload if needed.
          abortSignal: abortController.signal,
        });
        console.log(uploadResponse);
        setUploadedUrl(uploadResponse.name!);
      } catch (error) {
        // Handle specific error types provided by the ImageKit SDK.
        if (error instanceof ImageKitAbortError) {
          console.error("Upload aborted:", error.reason);
        } else if (error instanceof ImageKitInvalidRequestError) {
          console.error("Invalid request:", error.message);
        } else if (error instanceof ImageKitUploadNetworkError) {
          console.error("Network error:", error.message);
        } else if (error instanceof ImageKitServerError) {
          console.error("Server error:", error.message);
        } else {
          // Handle any other errors that may occur.
          console.error("Upload error:", error);
        }
      }
    };

    // Expose handleUpload to parent via ref
    useImperativeHandle(ref, () => ({
      handleUpload,
    }));

    return (
      <>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {previewUrl && !uploadedUrl && (
          <NextImage
            src={previewUrl}
            alt="Preview"
            width={500}
            height={500}
            unoptimized
            className="aspect-3/2 object-cover mx-auto rounded shadow"
          />
        )}

        {uploadedUrl && (
        <ImageKitProvider urlEndpoint={`${config.env.imagekit.urlEndpoint}/${folder}/`}>
          <Image
            src={uploadedUrl}
            width={500}
            height={500}
            alt="Uploaded image"
            className="aspect-3/2 object-cover mx-auto rounded shadow"
          />
        </ImageKitProvider>
      )}

        <Button
          onClick={(e) => {
            e.preventDefault();
            fileInputRef.current?.click();
          }}
          className={cn("upload-btn", "bg-dark-300 text-light-100")}
        >
          <NextImage
            src="/icons/upload.svg"
            alt="upload-icon"
            width={20}
            height={20}
            className="object-contain"
          />
          <p className="text-base text-light-100">{placeholder}</p>
        </Button>
        {progress > 0 && progress !== 100 && (
          <div className="w-full rounded-full bg-green-200">
            <div className="progress" style={{ width: `${progress}%` }}>
              {progress}%
            </div>
          </div>
        )}
      </>
    );
  }
);

ImageUpload.displayName = "ImageUpload";
export default ImageUpload;
