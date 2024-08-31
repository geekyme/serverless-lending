"use client";

import React, { useState } from "react";
import { LoanDetails } from "../../types/Business";
import { toast } from "react-hot-toast";

interface LoanDetailsFormProps {
  loanDetails: LoanDetails;
  setLoanDetails: React.Dispatch<React.SetStateAction<LoanDetails>>;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const LoanDetailsForm: React.FC<LoanDetailsFormProps> = ({
  loanDetails,
  setLoanDetails,
  onBack,
  onSubmit,
}) => {
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoanDetails, string>>
  >({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLoanDetails((prev) => ({
      ...prev,
      [name]:
        name === "requestedAmount" ||
        name === "loanTerm" ||
        name === "collateralValue"
          ? Number(value)
          : value,
    }));
    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof LoanDetails, string>> = {};
    if (!loanDetails.requestedAmount)
      newErrors.requestedAmount = "Requested amount is required";
    if (!loanDetails.loanPurpose)
      newErrors.loanPurpose = "Loan purpose is required";
    if (!loanDetails.loanTerm) newErrors.loanTerm = "Loan term is required";
    // Add more validations as needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Loan Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="requestedAmount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Requested Amount
          </label>
          <input
            id="requestedAmount"
            type="number"
            name="requestedAmount"
            value={loanDetails.requestedAmount || ""}
            onChange={handleChange}
            placeholder="Enter requested amount"
            className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              errors.requestedAmount ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.requestedAmount && (
            <p className="mt-1 text-sm text-red-500">
              {errors.requestedAmount}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="loanPurpose"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Loan Purpose
          </label>
          <input
            id="loanPurpose"
            type="text"
            name="loanPurpose"
            value={loanDetails.loanPurpose || ""}
            onChange={handleChange}
            placeholder="Enter loan purpose"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="loanTerm"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Loan Term (months)
          </label>
          <input
            id="loanTerm"
            type="number"
            name="loanTerm"
            value={loanDetails.loanTerm || ""}
            onChange={handleChange}
            placeholder="Enter loan term"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="collateralType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Collateral Type
          </label>
          <input
            id="collateralType"
            type="text"
            name="collateralType"
            value={loanDetails.collateralType || ""}
            onChange={handleChange}
            placeholder="Enter collateral type"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="collateralValue"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Collateral Value
          </label>
          <input
            id="collateralValue"
            type="number"
            name="collateralValue"
            value={loanDetails.collateralValue || ""}
            onChange={handleChange}
            placeholder="Enter collateral value"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="w-1/2 bg-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-400 transition duration-300"
          >
            Back
          </button>
          <button
            type="submit"
            className="w-1/2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoanDetailsForm;
