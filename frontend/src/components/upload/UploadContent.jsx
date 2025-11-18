import React, { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import UploadDropzone from "./UploadDropzone";
import ThumbnailUploader from "./ThumbnailUploader";
import UploadPreview from "./UploadPreview";
import UploadInfo from "./UploadInfo";
import {
  CircleChevronDown,
  CircleChevronUp,
  AlertCircle,
  Loader,
} from "lucide-react";

const UploadContent = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fullTextArea, setFullTextArea] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

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
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      videoFile: "",
      title: "",
      description: "",
      thumbnail: "",
      category: "",
      isPublished: true,
    },
    mode: "onSubmit",
  });

  const title = watch("title");
  const description = watch("description");
  const selectedCategories = watch("category") || [];

  const onSubmit = async (data) => {
    if (!videoFile) {
      setError("Please select video.");
      toast.error("Missing video file!");
      return;
    }
    if (!thumbnailFile) {
      setError("Please select thumbnail.");
      toast.error("Missing thumbnail file!");
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);
    setError(null);

    let dummyInterval = null;

    try {
      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("thumbnail", thumbnailFile);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("isPublished", data.isPublished);

      const response = await axios.post("/api/v1/videos/publish", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          // Clear dummy interval once real upload starts
          if (dummyInterval) {
            clearInterval(dummyInterval);
            dummyInterval = null;
          }

          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          // Cap at 95% until we get success response
          const cappedProgress = Math.min(percentCompleted, 95);
          setUploadProgress(cappedProgress);

          // Start dummy progress for the last 5% (server processing)
          if (cappedProgress >= 95 && !dummyInterval) {
            let processingProgress = 95;
            dummyInterval = setInterval(() => {
              processingProgress += 0.5;
              if (processingProgress >= 99) {
                processingProgress = 99;
                clearInterval(dummyInterval);
              }
              setUploadProgress(processingProgress);
            }, 500);
          }
        },
      });

      // Clear any remaining interval
      if (dummyInterval) {
        clearInterval(dummyInterval);
      }

      setUploadProgress(100);
      toast.success(response.data.message || "Video published successfully!");

      reset();
      setVideoFile(null);
      setThumbnailFile(null);
      setTimeout(() => setUploadProgress(0), 2000);
    } catch (err) {
      // Clear interval on error
      if (dummyInterval) {
        clearInterval(dummyInterval);
      }

      const errorMessage =
        err.response?.data?.message ||
        "An error occurred while uploading the video.";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        duration: 4000,
      });
      setUploadProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-10 py-6 relative">
      <div className="max-w-6xl mx-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10"
        >
          <div className="lg:col-span-2 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="max-sm:hidden text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                Upload Video
              </h1>
              <p className="text-gray-600">
                Share your content on{" "}
                <span className="inline-flex items-baseline">
                  <span className="font-bold text-gray-800 text-lg tracking-tight">
                    Video
                  </span>
                  <span className="font-bold text-primary text-lg tracking-tight">
                    Tube
                  </span>
                </span>
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <UploadDropzone
              onFileSelect={setVideoFile}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              videoInputRef={videoInputRef}
              disabled={isLoading}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Title *
                  </label>
                  <input
                    {...register("title", {
                      required: "Title is required",
                      minLength: {
                        value: 10,
                        message: "Title must be at least 10 characters",
                      },
                    })}
                    placeholder="Enter a compelling title..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none disabled:opacity-50"
                    disabled={isLoading}
                  />
                  {errors.title && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                      minLength: {
                        value: 10,
                        message: "Description must be at least 10 characters",
                      },
                    })}
                    placeholder="Tell viewers about your video..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 resize-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none disabled:opacity-50"
                    rows={fullTextArea ? 10 : 4}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute top-9 right-3 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                    onClick={() => setFullTextArea(!fullTextArea)}
                    disabled={isLoading}
                  >
                    {fullTextArea ? (
                      <CircleChevronUp size={20} />
                    ) : (
                      <CircleChevronDown size={20} />
                    )}
                  </button>
                  {errors.description && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categories * (Select 1-5)
                  </label>
                  <span className="text-xs text-gray-500">
                    {selectedCategories.length}/5 selected
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { value: "music", label: "Music" },
                      { value: "animals", label: "Animals" },
                      { value: "education", label: "Education" },
                      { value: "entertainment", label: "Entertainment" },
                      { value: "technology", label: "Technology" },
                      { value: "news", label: "News" },
                      { value: "food", label: "Food" },
                    ].map((cat) => {
                      const isChecked = selectedCategories.includes(cat.value);
                      const isDisabled =
                        isLoading ||
                        (!isChecked && selectedCategories.length >= 5);

                      return (
                        <label
                          key={cat.value}
                          className={`flex items-center gap-2 p-1   rounded-lg cursor-pointer border border-gray-50 transition-all ${
                            isDisabled ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            value={cat.value}
                            {...register("category", {
                              required: "Select at least one category",
                              validate: (value) =>
                                (Array.isArray(value) &&
                                  value.length > 0 &&
                                  value.length <= 5) ||
                                "Select 1-5 categories",
                            })}
                            className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary cursor-pointer disabled:cursor-not-allowed"
                            disabled={isDisabled}
                          />
                          <span className="text-xs">{cat.label}</span>
                        </label>
                      );
                    })}
                  </div>
                  {errors.category && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </div>

              <ThumbnailUploader
                onFileSelect={setThumbnailFile}
                thumbnailPreview={thumbnailPreview}
                thumbnailInputRef={thumbnailInputRef}
                disabled={isLoading}
              />
            </div>

            <UploadPreview
              title={title}
              description={description}
              thumbnailPreview={thumbnailPreview}
            />

            <div className="flex flex-wrap gap-4 pt-4 items-center max-sm:justify-center">
              {isLoading && uploadProgress > 0 && (
                <div className="w-52 space-y-2">
                  <div className="flex items-center ml-10 text-sm font-medium text-gray-700">
                    <div className="flex h-7 w-7 justify-center animate-spin">
                      <Loader className="w-6 h-6 text-primary animate-pulse" />
                    </div>
                    <span className="whitespace-nowrap">
                      {uploadProgress < 95
                        ? "Uploading..."
                        : uploadProgress < 100
                        ? "Processing..."
                        : "Complete!"}
                    </span>
                  </div>

                  <div className="relative w-full h-2 rounded-full bg-gray-200 overflow-hidden shadow-inner">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-indigo-600 rounded-full transition-all duration-500 ease-out shadow-md"
                      style={{ width: `${uploadProgress}%` }}
                    />
                    <span className="absolute top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-800 left-1/2 -translate-x-1/2">
                      {Math.round(uploadProgress)}%
                    </span>
                  </div>
                </div>
              )}
              <button
                type="submit"
                className="bg-gradient-to-r from-primary to-indigo-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Uploading..." : "Publish Now"}
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <UploadInfo />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadContent;
