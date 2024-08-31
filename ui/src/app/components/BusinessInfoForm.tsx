"use client";

import React, { useState } from "react";
import { Business } from "../../types/Business";
import { toast } from "react-hot-toast";

interface BusinessInfoFormProps {
  business: Business;
  setBusiness: React.Dispatch<React.SetStateAction<Business>>;
  onNext: () => void;
}

const BusinessInfoForm: React.FC<BusinessInfoFormProps> = ({
  business,
  setBusiness,
  onNext,
}) => {
  const [errors, setErrors] = useState<Partial<Record<keyof Business, string>>>(
    {}
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBusiness((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Business, string>> = {};
    if (!business.legalName) newErrors.legalName = "Legal name is required";
    if (!business.businessStructure)
      newErrors.businessStructure = "Business structure is required";
    // Add more validations as needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Business Information</h2>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="legalName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Legal Name
          </label>
          <input
            id="legalName"
            type="text"
            name="legalName"
            value={business.legalName || ""}
            onChange={handleChange}
            placeholder="Enter legal name"
            className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              errors.legalName ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.legalName && (
            <p className="mt-1 text-sm text-red-500">{errors.legalName}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="tradingName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Trading Name
          </label>
          <input
            id="tradingName"
            type="text"
            name="tradingName"
            value={business.tradingName || ""}
            onChange={handleChange}
            placeholder="Enter trading name"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="businessStructure"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Business Structure
          </label>
          <select
            id="businessStructure"
            name="businessStructure"
            value={business.businessStructure || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Business Structure</option>
            <option value="SOLE_PROPRIETORSHIP">Sole Proprietorship</option>
            <option value="PARTNERSHIP">Partnership</option>
            <option value="LLC">LLC</option>
            <option value="CORPORATION">Corporation</option>
          </select>
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={business.email || ""}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        {/* Add more fields for taxId, dateEstablished, numberOfEmployees, etc. */}
        <button
          type="button"
          onClick={handleNext}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BusinessInfoForm;
