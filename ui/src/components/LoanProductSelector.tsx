import React, { useEffect, useState } from "react";
import { getLoanProducts } from "../api/loanApi";
import { LoanProduct } from "../types/LoanProduct";

interface LoanProductSelectorProps {
  onSelect: (productId: string) => void;
}

const LoanProductSelector: React.FC<LoanProductSelectorProps> = ({
  onSelect,
}) => {
  const [products, setProducts] = useState<LoanProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getLoanProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch loan products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <h3 className="mb-2 font-bold">Select a Loan Product</h3>
      <select
        onChange={(e) => onSelect(e.target.value)}
        className="w-full border p-2"
      >
        <option value="">Select a product</option>
        {products.map((product) => (
          <option key={product.productId} value={product.productId}>
            {product.productName} - ${product.minLoanAmount} to $
            {product.maxLoanAmount}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LoanProductSelector;
