import React, { useState } from "react";
import { DocumentTextIcon, ArrowUpTrayIcon } from "@heroicons/react/24/solid";

export default function C4() {
  const [documents, setDocuments] = useState([]);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    setDocuments([...documents, ...files]);
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">My Documents</h1>

      {/* Upload Section */}
      <label className="flex items-center gap-3 cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg w-fit shadow-sm hover:bg-blue-100">
        <ArrowUpTrayIcon className="w-5 h-5" />
        <span>Upload Document</span>
        <input
          type="file"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </label>

      {/* Documents List */}
      {documents.length > 0 ? (
        <ul className="space-y-3">
          {documents.map((doc, index) => (
            <li
              key={index}
              className="flex items-center gap-3 p-3 border rounded-lg shadow-sm bg-white"
            >
              <DocumentTextIcon className="w-6 h-6 text-blue-500" />
              <span className="text-gray-700">{doc.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No documents uploaded yet.</p>
      )}
    </div>
  );
}
