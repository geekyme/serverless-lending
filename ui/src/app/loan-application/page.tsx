import React from "react";
import LoanApplicationForm from "../components/LoanApplicationForm";

export default function LoanApplicationPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Finloan Application
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <LoanApplicationForm />
      </div>
    </div>
  );
}
