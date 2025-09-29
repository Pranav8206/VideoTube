import React, { useState } from "react";
import { CloudUpload } from "lucide-react";

const UploadDropzone = ({
  onFileSelect,
  isDragging,
  setIsDragging,
  videoInputRef,
}) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("video/")) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    onFileSelect(file);
    setPreviewUrl(URL.createObjectURL(file));
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-2xl border-2  transition-all  group cursor-pointer ${
        isDragging ? "border-purple-600 bg-purple-50/50" : "border-purple-300"
      } ${previewUrl ? "border-dotted bg-purple-100" : "border-dashed p-3 "} `}
    >
      <div
        className="flex flex-col items-center justify-center text-center gap-3"
        onClick={() => videoInputRef.current?.click()}
      >
        {/* Upload Icon / Video Preview */}
        <div
          className={`${
            previewUrl ? "s:w-80  h-40 rounded-lg" : "w-20 h-20 rounded-full"
          }   bg-purple-100 text-purple-600 flex items-center justify-center overflow-hidden`}
        >
          {previewUrl ? (
            <video
              onClick={(e) => e.stopPropagation()}
              src={previewUrl}
              className="w-full h-full object-cover"
              controls
            />
          ) : (
            <CloudUpload size={50} strokeWidth={1.5} />
          )}
        </div>

        {/* Text Message */}
        <div className="text-gray-700 font-medium">
          {previewUrl ? (
            <span className="text-green-600">
              🎉 Video uploaded successfully!{" "}
              <span className="text-gray-600 font-light text-sm group-required: group-hover:underline">
                Change
              </span>
            </span>
          ) : (
            <div className="text-sm">
              Drag & drop your video here, or{" "}
              <button
                type="button"
                className="text-purple-600 cursor-pointer group-hover:underline"
              >
                Browse
              </button>
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default UploadDropzone;
