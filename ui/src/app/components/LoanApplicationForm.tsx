"use client";

import React, { useState } from "react";
import { Business, LoanDetails, LoanApplication } from "../../types/Business";
import BusinessInfoForm from "./BusinessInfoForm";
import LoanDetailsForm from "./LoanDetailsForm";
import DocumentUpload from "./DocumentUpload";
import { submitLoanApplication } from "../../api/loanApi";
import { toast } from "react-hot-toast";

const LoanApplicationForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [business, setBusiness] = useState<Business>({} as Business);
  const [loanDetails, setLoanDetails] = useState<LoanDetails>({
    requestedAmount: 0,
    loanPurpose: "",
    loanTerm: 0,
    collateralType: "",
    collateralValue: 0,
  });
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const applicationData: LoanApplication = {
        business,
        ...loanDetails,
        applicantEmail: business.email,
      };
      const response = await submitLoanApplication(applicationData);
      console.log("Application submitted:", response);
      setApplicationId(response?.applicationId ?? null);
      setStep(3); // Move to document upload step
      toast.success("Application submitted successfully!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error submitting application:", error.message);
        toast.error(`Error submitting application: ${error.message}`);
      } else {
        console.error("Unknown error submitting application");
        toast.error(
          "An unknown error occurred while submitting the application"
        );
      }
    }
  };

  return (
    <div>
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
      {step === 1 && (
        <BusinessInfoForm
          business={business}
          setBusiness={setBusiness}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <LoanDetailsForm
          loanDetails={loanDetails}
          setLoanDetails={setLoanDetails}
          onBack={() => setStep(1)}
          onSubmit={handleSubmit}
        />
      )}
      {step === 3 && applicationId && (
        <DocumentUpload applicationId={applicationId} />
      )}
    </div>
  );
};

export default LoanApplicationForm;
