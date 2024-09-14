"use client";

import React, { useState } from "react";
import { submitLoanApplication } from "@/api/loanApi";
import LoanProductSelector from "@/components/LoanProductSelector";
import { toast } from "react-hot-toast";
import { LoanApplication, Business, LoanDetails } from "@/types/Business";

const LoanApplicationForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<LoanApplication>({
    businessId: "",
    productId: "",
    business: {
      id: "",
      businessName: "",
      legalName: "",
      tradingName: "",
      businessStructure: "SOLE_PROPRIETORSHIP",
      taxId: "",
      dateEstablished: "",
      numberOfEmployees: 0,
      annualRevenue: 0,
      industryCode: "",
      email: "",
      address: {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },
      contactInformation: {
        primaryContactName: "",
        phoneNumber: "",
        email: "",
      },
      financialStatements: {
        balanceSheet: {
          totalAssets: 0,
          totalLiabilities: 0,
          ownersEquity: 0,
          currentAssets: 0,
          currentLiabilities: 0,
        },
        incomeStatement: {
          revenue: 0,
          expenses: 0,
          netIncome: 0,
        },
        cashFlowStatement: {
          operatingCashFlow: 0,
          investingCashFlow: 0,
          financingCashFlow: 0,
        },
      },
    },
    requestedAmount: 0,
    loanPurpose: "",
    loanTerm: 0,
    collateralType: "",
    collateralValue: 0,
    applicantEmail: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBusinessChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      business: {
        ...prevData.business,
        [name]: value,
      },
    }));
  };

  const handleProductSelect = (productId: string) => {
    setFormData((prevData) => ({ ...prevData, productId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await submitLoanApplication(formData);
      toast.success("Loan application submitted successfully");
      setStep(3); // Move to document upload step
    } catch (error) {
      console.error("Failed to submit loan application:", error);
      toast.error("Failed to submit loan application");
    }
  };

  const renderBusinessInfoForm = () => (
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
            value={formData.business.legalName}
            onChange={handleBusinessChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label
            htmlFor="businessName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Business Name
          </label>
          <input
            id="businessName"
            type="text"
            name="businessName"
            value={formData.business.businessName}
            onChange={handleBusinessChange}
            className="w-full p-2 border rounded-md"
            required
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
            value={formData.business.businessStructure}
            onChange={handleBusinessChange}
            className="w-full p-2 border rounded-md"
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
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Business Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.business.email}
            onChange={handleBusinessChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        {/* Add more fields for business information */}
        <button
          type="button"
          onClick={() => setStep(2)}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderLoanDetailsForm = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Loan Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <LoanProductSelector onSelect={handleProductSelect} />
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
            value={formData.requestedAmount}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label
            htmlFor="loanPurpose"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Loan Purpose
          </label>
          <textarea
            id="loanPurpose"
            name="loanPurpose"
            value={formData.loanPurpose}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
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
            value={formData.loanTerm}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
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
            value={formData.collateralType}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
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
            value={formData.collateralValue}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setStep(1)}
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

  const renderDocumentUpload = () => (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Upload Documents</h3>
      {/* Implement document upload functionality here */}
      <p>Document upload functionality to be implemented.</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center">
          <div
            className={`w-1/3 h-2 ${step >= 1 ? "bg-blue-600" : "bg-gray-300"}`}
          ></div>
          <div
            className={`w-1/3 h-2 ${step >= 2 ? "bg-blue-600" : "bg-gray-300"}`}
          ></div>
          <div
            className={`w-1/3 h-2 ${step >= 3 ? "bg-blue-600" : "bg-gray-300"}`}
          ></div>
        </div>
        <div className="flex justify-between mt-2">
          <span
            className={`text-sm ${
              step === 1 ? "text-blue-600 font-semibold" : "text-gray-500"
            }`}
          >
            Business Information
          </span>
          <span
            className={`text-sm ${
              step === 2 ? "text-blue-600 font-semibold" : "text-gray-500"
            }`}
          >
            Loan Details
          </span>
          <span
            className={`text-sm ${
              step === 3 ? "text-blue-600 font-semibold" : "text-gray-500"
            }`}
          >
            Document Upload
          </span>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        {step === 1 && renderBusinessInfoForm()}
        {step === 2 && renderLoanDetailsForm()}
        {step === 3 && renderDocumentUpload()}
      </div>
    </div>
  );
};

export default LoanApplicationForm;
