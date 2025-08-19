import React, { useState, useEffect } from "react";
import {
  DocumentTextIcon,
  ArrowUpTrayIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

export default function C4() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [userId, setUserId] = useState("68a1ca9892c8c177a63ee0d0");

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://${import.meta.env.VITE_EC2_ENDPOINT}/api/files/${userId}`
      );
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setIsUploading(true);
    try {
      for (let file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", userId)
        const res = await fetch(`http://${import.meta.env.VITE_EC2_ENDPOINT}/api/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.status === "success") {
          setDocuments((prevDocs) => [
            { url: data.url, public_id: data.public_id },
            ...prevDocs,
          ]);
        }
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (publicId) => {
    setDeletingId(publicId);
    try {
      // ✅ FIX: URL-encode the publicId to handle slashes
      await fetch(
        `https://${import.meta.env.VITE_EC2_ENDPOINT}/api/delete/${encodeURIComponent(publicId)}`,
        {
          method: "DELETE",
        }
      );
      setDocuments((prev) =>
        prev.filter((doc) => doc.public_id !== publicId)
      );
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">My Documents</h1>

      <label
        className={`flex items-center gap-3 cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg w-fit shadow-sm transition-colors ${
          isUploading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-100"
        }`}
      >
        <ArrowUpTrayIcon className="w-5 h-5" />
        <span>{isUploading ? "Uploading..." : "Upload Document"}</span>
        <input
          type="file"
          multiple
          className="hidden"
          onChange={handleUpload}
          disabled={isUploading}
        />
      </label>

      {isUploading && (
        <div className="flex items-center justify-start p-2 text-gray-500">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Processing your files, please wait...</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-5 text-gray-500">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Loading documents...</span>
        </div>
      ) : documents.length > 0 ? (
        <ul className="space-y-3">
          {documents.map((doc) => (
            <li
              key={doc.public_id}
              className="flex items-center gap-3 p-3 border rounded-lg shadow-sm bg-white"
            >
              <DocumentTextIcon className="w-6 h-6 text-blue-500" />
              <span className="text-gray-700 truncate max-w-xs">
                {doc.originalName}
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
                className="text-red-500 hover:text-red-700 ml-3 w-5 h-5 flex items-center justify-center"
                disabled={deletingId === doc.public_id}
              >
                {deletingId === doc.public_id ? (
                  <svg
                    className="animate-spin h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <TrashIcon className="w-5 h-5" />
                )}
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