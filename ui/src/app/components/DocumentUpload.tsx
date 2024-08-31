"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadDocument } from "../../api/loanApi";
import { toast } from "react-hot-toast";

interface DocumentUploadProps {
  applicationId: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ applicationId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("");
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !documentType) {
      toast.error("Please select a file and document type");
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const base64Content = Buffer.from(arrayBuffer).toString("base64");

      const response = await uploadDocument({
        applicationId,
        documentType,
        fileContent: base64Content,
        fileName: file.name,
      });

      toast.success("Document uploaded successfully");
      console.log("Upload response:", response);
      router.push("/thank-you");
    } catch (error) {
      toast.error("Error uploading document");
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Upload Documents</h3>
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label
            htmlFor="documentType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Document Type
          </label>
          <select
            id="documentType"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Document Type</option>
            <option value="BUSINESS_LICENSE">Business License</option>
            <option value="FINANCIAL_STATEMENT">Financial Statement</option>
            <option value="TAX_RETURN">Tax Return</option>
            <option value="BANK_STATEMENT">Bank Statement</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="file"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            File
          </label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Upload Document
        </button>
      </form>
    </div>
  );
};

export default DocumentUpload;
