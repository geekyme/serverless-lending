"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface LoanProduct {
  productId: string;
  versionNumber: number;
  productName: string;
  productType: string;
  minLoanAmount: number;
  maxLoanAmount: number;
  interestRateType: "Fixed" | "Variable";
  baseInterestRate: number;
  termOptions: number[];
  eligibilityCriteria: object;
  fees: object;
  collateralRequirements: string;
  underwritingGuidelines: string;
  status: "Active" | "Inactive" | "Deprecated";
  createdAt: string;
  updatedAt: string;
}

const LoanProductsAdminPage: React.FC = () => {
  const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchLoanProducts();
  }, []);

  const fetchLoanProducts = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/loan-products`
      );
      if (!response.ok) throw new Error("Failed to fetch loan products");
      const data = await response.json();
      setLoanProducts(data);
    } catch (error) {
      console.error("Error fetching loan products:", error);
      toast.error("Failed to load loan products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = (product: LoanProduct) => {
    setSelectedProduct(product);
    setIsEditing(false);
  };

  const handleCreateProduct = async (
    newProduct: Omit<
      LoanProduct,
      "productId" | "versionNumber" | "status" | "createdAt" | "updatedAt"
    >
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/loan-products`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProduct),
        }
      );
      if (!response.ok) throw new Error("Failed to create loan product");
      toast.success("Loan product created successfully");
      fetchLoanProducts();
    } catch (error) {
      console.error("Error creating loan product:", error);
      toast.error("Failed to create loan product");
    }
  };

  const handleUpdateProduct = async (
    updatedProductData: Omit<
      LoanProduct,
      "productId" | "versionNumber" | "status" | "createdAt" | "updatedAt"
    >
  ) => {
    if (!selectedProduct) return;
    const updatedProduct = { ...selectedProduct, ...updatedProductData };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/loan-products/${selectedProduct.productId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProduct),
        }
      );
      if (!response.ok) throw new Error("Failed to update loan product");
      toast.success("Loan product updated successfully");
      fetchLoanProducts();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating loan product:", error);
      toast.error("Failed to update loan product");
    }
  };

  const handleDeprecateProduct = async (productId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/loan-products/${productId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to deprecate loan product");
      toast.success("Loan product deprecated successfully");
      fetchLoanProducts();
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error deprecating loan product:", error);
      toast.error("Failed to deprecate loan product");
    }
  };

  const renderProductList = () => (
    <div className="w-1/3 pr-4">
      <h2 className="text-xl font-semibold mb-4">Loan Products</h2>
      {isLoading ? (
        <p>Loading products...</p>
      ) : (
        <ul className="space-y-2">
          {loanProducts.map((product) => (
            <li
              key={product.productId}
              className={`cursor-pointer p-2 rounded ${
                selectedProduct?.productId === product.productId
                  ? "bg-blue-100"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleProductSelect(product)}
            >
              {product.productName}
            </li>
          ))}
        </ul>
      )}
      <button
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        onClick={() => setSelectedProduct(null)}
      >
        Create New Product
      </button>
    </div>
  );

  const renderProductDetails = () => (
    <div className="w-2/3 pl-4">
      <h2 className="text-xl font-semibold mb-4">
        {selectedProduct ? "Product Details" : "Create New Product"}
      </h2>
      {selectedProduct ? (
        isEditing ? (
          <ProductForm
            product={selectedProduct}
            onSubmit={handleUpdateProduct}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <ProductDetails
            product={selectedProduct}
            onEdit={() => setIsEditing(true)}
            onDeprecate={() =>
              handleDeprecateProduct(selectedProduct.productId)
            }
          />
        )
      ) : (
        <ProductForm
          onSubmit={handleCreateProduct}
          onCancel={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Loan Products Administration</h1>
      <div className="flex">
        {renderProductList()}
        {renderProductDetails()}
      </div>
    </div>
  );
};

const ProductForm: React.FC<{
  product?: LoanProduct;
  onSubmit: (
    product: Omit<
      LoanProduct,
      "productId" | "versionNumber" | "status" | "createdAt" | "updatedAt"
    >
  ) => void;
  onCancel: () => void;
}> = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<
    Omit<
      LoanProduct,
      "productId" | "versionNumber" | "status" | "createdAt" | "updatedAt"
    >
  >({
    productName: product?.productName || "",
    productType: product?.productType || "",
    minLoanAmount: product?.minLoanAmount || 0,
    maxLoanAmount: product?.maxLoanAmount || 0,
    interestRateType: product?.interestRateType || "Fixed",
    baseInterestRate: product?.baseInterestRate || 0,
    termOptions: product?.termOptions || [],
    eligibilityCriteria: product?.eligibilityCriteria || {},
    fees: product?.fees || {},
    collateralRequirements: product?.collateralRequirements || "",
    underwritingGuidelines: product?.underwritingGuidelines || "",
  });

  const [termOptionsInput, setTermOptionsInput] = useState(
    product?.termOptions.join(", ") || ""
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTermOptionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTermOptionsInput(value);

    const termOptions = value
      .split(",")
      .map((term) => {
        const parsedTerm = parseInt(term.trim(), 10);
        return isNaN(parsedTerm) ? 0 : parsedTerm;
      })
      .filter((term) => term > 0);

    setFormData((prev) => ({ ...prev, termOptions }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="productName"
          className="block text-sm font-medium text-gray-700"
        >
          Product Name
        </label>
        <input
          type="text"
          id="productName"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border rounded-md"
          required
        />
      </div>
      <div>
        <label
          htmlFor="productType"
          className="block text-sm font-medium text-gray-700"
        >
          Product Type
        </label>
        <input
          type="text"
          id="productType"
          name="productType"
          value={formData.productType}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border rounded-md"
          required
        />
      </div>
      <div>
        <label
          htmlFor="minLoanAmount"
          className="block text-sm font-medium text-gray-700"
        >
          Minimum Loan Amount
        </label>
        <input
          type="number"
          id="minLoanAmount"
          name="minLoanAmount"
          value={formData.minLoanAmount}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border rounded-md"
          required
        />
      </div>
      <div>
        <label
          htmlFor="maxLoanAmount"
          className="block text-sm font-medium text-gray-700"
        >
          Maximum Loan Amount
        </label>
        <input
          type="number"
          id="maxLoanAmount"
          name="maxLoanAmount"
          value={formData.maxLoanAmount}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border rounded-md"
          required
        />
      </div>
      <div>
        <label
          htmlFor="interestRateType"
          className="block text-sm font-medium text-gray-700"
        >
          Interest Rate Type
        </label>
        <select
          id="interestRateType"
          name="interestRateType"
          value={formData.interestRateType}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border rounded-md"
          required
        >
          <option value="Fixed">Fixed</option>
          <option value="Variable">Variable</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="baseInterestRate"
          className="block text-sm font-medium text-gray-700"
        >
          Base Interest Rate (%)
        </label>
        <input
          type="number"
          id="baseInterestRate"
          name="baseInterestRate"
          value={formData.baseInterestRate}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border rounded-md"
          required
          step="0.01"
        />
      </div>
      <div>
        <label
          htmlFor="termOptions"
          className="block text-sm font-medium text-gray-700"
        >
          Term Options (months, comma-separated)
        </label>
        <input
          type="text"
          id="termOptions"
          name="termOptions"
          value={termOptionsInput}
          onChange={handleTermOptionsChange}
          className="mt-1 block w-full p-2 border rounded-md"
          placeholder="e.g., 12, 24, 36, 48"
          required
        />
      </div>
      <div>
        <label
          htmlFor="collateralRequirements"
          className="block text-sm font-medium text-gray-700"
        >
          Collateral Requirements
        </label>
        <textarea
          id="collateralRequirements"
          name="collateralRequirements"
          value={formData.collateralRequirements}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border rounded-md"
          rows={3}
        />
      </div>
      <div>
        <label
          htmlFor="underwritingGuidelines"
          className="block text-sm font-medium text-gray-700"
        >
          Underwriting Guidelines
        </label>
        <textarea
          id="underwritingGuidelines"
          name="underwritingGuidelines"
          value={formData.underwritingGuidelines}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border rounded-md"
          rows={3}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {product ? "Update" : "Create"} Product
        </button>
      </div>
    </form>
  );
};

const ProductDetails: React.FC<{
  product: LoanProduct;
  onEdit: () => void;
  onDeprecate: () => void;
}> = ({ product, onEdit, onDeprecate }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold">Product Name:</h3>
        <p>{product.productName}</p>
      </div>
      <div>
        <h3 className="font-semibold">Product Type:</h3>
        <p>{product.productType}</p>
      </div>
      <div>
        <h3 className="font-semibold">Loan Amount Range:</h3>
        <p>
          ${product.minLoanAmount.toLocaleString()} - $
          {product.maxLoanAmount.toLocaleString()}
        </p>
      </div>
      <div>
        <h3 className="font-semibold">Interest Rate:</h3>
        <p>
          {product.interestRateType} - {product.baseInterestRate}%
        </p>
      </div>
      <div>
        <h3 className="font-semibold">Term Options:</h3>
        <p>{product.termOptions.join(", ")} months</p>
      </div>
      <div>
        <h3 className="font-semibold">Collateral Requirements:</h3>
        <p>{product.collateralRequirements}</p>
      </div>
      <div>
        <h3 className="font-semibold">Underwriting Guidelines:</h3>
        <p>{product.underwritingGuidelines}</p>
      </div>
      <div>
        <h3 className="font-semibold">Eligibility Criteria:</h3>
        <pre>{JSON.stringify(product.eligibilityCriteria, null, 2)}</pre>
      </div>
      <div>
        <h3 className="font-semibold">Fees:</h3>
        <pre>{JSON.stringify(product.fees, null, 2)}</pre>
      </div>
      <div>
        <h3 className="font-semibold">Status:</h3>
        <p>{product.status}</p>
      </div>
      <div>
        <h3 className="font-semibold">Version:</h3>
        <p>{product.versionNumber}</p>
      </div>
      <div>
        <h3 className="font-semibold">Created At:</h3>
        <p>{new Date(product.createdAt).toLocaleString()}</p>
      </div>
      <div>
        <h3 className="font-semibold">Updated At:</h3>
        <p>{new Date(product.updatedAt).toLocaleString()}</p>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Edit
        </button>
        <button
          onClick={onDeprecate}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Deprecate
        </button>
      </div>
    </div>
  );
};

export default LoanProductsAdminPage;
