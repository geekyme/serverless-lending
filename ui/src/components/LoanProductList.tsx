import React from "react";
import { LoanProduct } from "../types/LoanProduct";

interface LoanProductListProps {
  products: LoanProduct[];
  onEdit: (product: LoanProduct) => void;
  onDeprecate: (productId: string) => void;
}

const LoanProductList: React.FC<LoanProductListProps> = ({
  products,
  onEdit,
  onDeprecate,
}) => {
  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">Name</th>
          <th className="border p-2">Type</th>
          <th className="border p-2">Min Amount</th>
          <th className="border p-2">Max Amount</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.productId}>
            <td className="border p-2">{product.productName}</td>
            <td className="border p-2">{product.productType}</td>
            <td className="border p-2">{product.minLoanAmount}</td>
            <td className="border p-2">{product.maxLoanAmount}</td>
            <td className="border p-2">
              <button
                onClick={() => onEdit(product)}
                className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => onDeprecate(product.productId)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Deprecate
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LoanProductList;
