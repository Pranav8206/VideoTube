import React from "react";

const UploadInfo = () => {
  return (
    <aside className="flex flex-wrap gap-6 pb-10">
      {/* Upload Guidelines */}
      <div className="flex-1 min-w-[250px] bg-gray-50 rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-3">
          Upload Guidelines
        </h3>
        <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
          <li>Video formats: MP4, MOV, MKV, WEBM</li>
          <li>Max file size: 10GB</li>
          <li>Recommended resolution: 1080p or 4K</li>
        </ul>
      </div>

      {/* Tips for more views */}
      <div className="flex-1 min-w-[250px] bg-gray-50 rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-3">
          Tips for more views
        </h3>
        <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
          <li>Use a clear, searchable title</li>
          <li>Write a compelling description</li>
          <li>Pick an eye-catching thumbnail</li>
        </ul>
      </div>
    </aside>
  );
};

export default UploadInfo;
