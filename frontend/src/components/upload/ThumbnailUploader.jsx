import { CircleCheckBig } from "lucide-react";
import React from "react";

const ThumbnailUploader = ({
  onFileSelect,
  thumbnailPreview,
  thumbnailInputRef,
}) => (
  <div className="flex justify-between flex-wrap">
    <div className="">
      <label
        htmlFor="thumbnail"
        className="text-sm font-medium text-gray-700 flex items-center "
      >
        Custom Thumbnail*
        {thumbnailPreview ? (
          <span>
            {" "}
            <CircleCheckBig
              size={16}
              className="fill-green-300 text-green-700"
            />{" "}
          </span>
        ) : (
          " "
        )}
      </label>
      <div className=" flex items-center gap-3">
        <button
          id="thumbnail"
          type="button"
          onClick={() => thumbnailInputRef.current?.click()}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer"
        >
          {thumbnailPreview ? "Change uploaded" : "Upload Thumbnail"}
        </button>
        <input
          ref={thumbnailInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => onFileSelect(e.target.files?.[0])}
          className="hidden"
        />
      </div>
    </div>
    <div className="items-start  w-1/2">
      {thumbnailPreview && (
        <div className="max-w-15">
          <img
            src={thumbnailPreview}
            alt="Thumbnail preview"
            className="w-full rounded-lg border border-gray-200 object-cover"
          />
        </div>
      )}
    </div>
  </div>
);

export default ThumbnailUploader;
