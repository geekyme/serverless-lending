import React, { useState, useEffect } from "react";
import { LoanProduct } from "../types/LoanProduct";

interface LoanProductFormProps {
  onSubmit: (productData: Omit<LoanProduct, "productId">) => void;
  initialData?: LoanProduct | null;
}

const LoanProductForm: React.FC<LoanProductFormProps> = ({
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<Omit<LoanProduct, "productId">>({
    productName: "",
    productType: "",
    minLoanAmount: 0,
    maxLoanAmount: 0,
    interestRateType: "Fixed",
    baseInterestRate: 0,
    termOptions: [],
    eligibilityCriteria: { minCreditScore: 0 },
    status: "Active",
    versionNumber: 1,
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          placeholder="Product Name"
          className="border p-2"
          required
        />
        <input
          type="text"
          name="productType"
          value={formData.productType}
          onChange={handleChange}
          placeholder="Product Type"
          className="border p-2"
          required
        />
        <input
          type="number"
          name="minLoanAmount"
          value={formData.minLoanAmount}
          onChange={handleChange}
          placeholder="Min Loan Amount"
          className="border p-2"
          required
        />
        <input
          type="number"
          name="maxLoanAmount"
          value={formData.maxLoanAmount}
          onChange={handleChange}
          placeholder="Max Loan Amount"
          className="border p-2"
          required
        />
        <select
          name="interestRateType"
          value={formData.interestRateType}
          onChange={handleChange}
          className="border p-2"
          required
        >
          <option value="Fixed">Fixed</option>
          <option value="Variable">Variable</option>
        </select>
        <input
          type="number"
          name="baseInterestRate"
          value={formData.baseInterestRate}
          onChange={handleChange}
          placeholder="Base Interest Rate"
          className="border p-2"
          required
        />
      </div>
      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        {initialData ? "Update" : "Create"} Loan Product
      </button>
    </form>
  );
};

export default LoanProductForm;
