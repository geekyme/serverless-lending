"use client";

import React from "react";
import LoanApplicationForm from "@/components/LoanApplicationForm";

const ApplyPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Apply for a Loan</h1>
      <LoanApplicationForm />
    </div>
  );
};

export default ApplyPage;
