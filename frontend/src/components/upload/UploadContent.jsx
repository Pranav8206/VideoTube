import React, { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import UploadDropzone from "./UploadDropzone";
import ThumbnailUploader from "./ThumbnailUploader";
import UploadPreview from "./UploadPreview";
import UploadInfo from "./UploadInfo";
import { CircleChevronDown, CircleChevronUp } from "lucide-react";

const UploadContent = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fullTextArea, setFullTextArea] = useState(false);

  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  const thumbnailPreview = useMemo(
    () => (thumbnailFile ? URL.createObjectURL(thumbnailFile) : ""),
    [thumbnailFile]
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields },
  } = useForm({
    defaultValues: {
      videoFile: "",
      title: "",
      description: "",
      category: "",
      visibility: "public",
    },
    mode: "onSubmit",
  });

  const title = watch("title");
  const description = watch("description");

  const onSubmit = async (data) => {
    console.log("Form Data:", data, { videoFile, thumbnailFile });
    // axios POST request here...
  };

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 md:px-10 py-2">
      <div className="max-w-6xl mx-auto">
        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-10"
        >
          {/* Left: Upload + Inputs */}
          <div className="lg:col-span-2 space-y-2 sm:space-y-8">
            {/* Header */}
            <h1 className="max-s:hidden text-2xl md:text-3xl font-bold text-center text-gray-800">
              Upload
            </h1>
            <p className="text-gray-500 text-center max-sm:py-2">
              Publish your video to{" "}
              <span className="underline underline-offset-2">
                <span className="font-semibold text-dark text-lg tracking-tight">
                  Video
                </span>
                <span className="font-semibold text-primary text-lg tracking-tighter">
                  Tube
                </span>
              </span>
            </p>
            <UploadDropzone
              onFileSelect={setVideoFile}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              videoInputRef={videoInputRef}
            />

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                {/* Title */}
                <input
                  {...register("title", {
                    required: "Title is required",
                    minLength: {
                      value: 10,
                      message: "Title must be at least 10 characters",
                    },
                  })}
                  placeholder="Title"
                  className="w-full rounded-lg border px-4 py-2"
                />
                {errors.title && (
                  <p className="text-red-600 text-xs -mt-3">
                    {errors.title.message}
                  </p>
                )}
                {/* Description */}
                <div className="relative">
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                      minLength: {
                        value: 10,
                        message: "Description must be at least 10 characters",
                      },
                    })}
                    placeholder="Description"
                    className="w-full rounded-lg border px-4 py-2 resize-y"
                    rows={fullTextArea ? 10 : 3}
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-2 text-gray-500 cursor-pointer"
                    onClick={() => setFullTextArea(!fullTextArea)}
                  >
                    {fullTextArea ? (
                      <CircleChevronUp size={20} />
                    ) : (
                      <CircleChevronDown size={20} />
                    )}
                  </button>

                  {errors.description && (
                    <p className="text-red-600  text-xs -mt-2">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <select
                  {...register("category", {
                    required: "Please select Category",
                  })}
                  className="w-full rounded-lg border border-black px-4 py-2 text-gray-500 cursor-pointer"
                >
                  <option value="" className="text-black">
                    Select a category
                  </option>
                  <option className="text-black cursor-pointer">Gaming</option>
                  <option className="text-black cursor-pointer">Music</option>
                  <option className="text-black cursor-pointer">Education</option>
                </select>
                {errors.category && (
                  <p className="text-red-600  text-xs -mt-3">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <ThumbnailUploader
                onFileSelect={setThumbnailFile}
                thumbnailPreview={thumbnailPreview}
                thumbnailInputRef={thumbnailInputRef}
              />
            </div>

            <UploadPreview
              title={title}
              description={description}
              thumbnailPreview={thumbnailPreview}
            />

            {/* Buttons */}
            <div className="mt-6 flex flex-wrap gap-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-primary to-indigo-600 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-full font-semibold shadow-md hover:opacity-70 transition cursor-pointer"
              >
                Publish
              </button>
              <button
                type="button"
                className="px-4 sm:px-8 py-2 sm:py-3 rounded-full border border-gray-300 text-gray-800 bg-white hover:bg-gray-50 cursor-pointer"
              >
                Save Draft
              </button>
            </div>
          </div>

          {/* Right: Upload Info */}
          <div className="lg:col-span-1">
            <UploadInfo />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadContent;
