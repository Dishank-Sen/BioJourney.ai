import React, { useState, useEffect } from "react";
import {
  DocumentTextIcon,
  ArrowUpTrayIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

export default function C4() {
  const [documents, setDocuments] = useState([]);

  // Fetch documents from backend (Cloudinary list)
  const fetchDocuments = async () => {
    try {
      const res = await fetch("http://localhost:8000/files");
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    }
  };

  // Run once when component mounts
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Upload files
  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);

    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("http://localhost:8000/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.status === "success") {
          // Refresh document list
          fetchDocuments();
        }
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }
  };

  // Delete a file
  const handleDelete = async (publicId) => {
    try {
      await fetch(`http://localhost:8000/delete/${publicId}`, {
        method: "DELETE",
      });
      setDocuments((prev) =>
        prev.filter((doc) => doc.public_id !== publicId)
      );
    } catch (err) {
      console.error("Delete failed:", err);
    }
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
              <span className="text-gray-700 truncate max-w-xs">
                {doc.url.split("/").pop()}
              </span>

              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline ml-auto"
              >
                View
              </a>

              <button
                onClick={() => handleDelete(doc.public_id)}
                className="text-red-500 hover:text-red-700 ml-3"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No documents uploaded yet.</p>
      )}
    </div>
  );
}