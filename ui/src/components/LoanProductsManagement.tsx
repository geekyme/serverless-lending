"use client";

import React, { useState, useEffect } from "react";
import {
  getLoanProducts,
  createLoanProduct,
  updateLoanProduct,
  deprecateLoanProduct,
} from "@/api/loanApi";
import { LoanProduct } from "@/types/LoanProduct";
import LoanProductForm from "./LoanProductForm";
import LoanProductList from "./LoanProductList";
import { toast } from "react-hot-toast";

const LoanProductsManagement: React.FC = () => {
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [editingProduct, setEditingProduct] = useState<LoanProduct | null>(
    null
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const fetchedProducts = await getLoanProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to fetch loan products");
    }
  };

  const handleCreateProduct = async (
    productData: Omit<LoanProduct, "productId">
  ) => {
    try {
      const newProduct = await createLoanProduct(productData);
      setProducts([...products, newProduct]);
      toast.success("Loan product created successfully");
    } catch (error) {
      console.error("Failed to create product:", error);
      toast.error("Failed to create loan product");
    }
  };

  const handleUpdateProduct = async (
    productId: string,
    productData: Partial<LoanProduct>
  ) => {
    try {
      const updatedProduct = await updateLoanProduct(productId, productData);
      setProducts(
        products.map((p) => (p.productId === productId ? updatedProduct : p))
      );
      setEditingProduct(null);
      toast.success("Loan product updated successfully");
    } catch (error) {
      console.error("Failed to update product:", error);
      toast.error("Failed to update loan product");
    }
  };

  const handleDeprecateProduct = async (productId: string) => {
    try {
      await deprecateLoanProduct(productId);
      setProducts(products.filter((p) => p.productId !== productId));
      toast.success("Loan product deprecated successfully");
    } catch (error) {
      console.error("Failed to deprecate product:", error);
      toast.error("Failed to deprecate loan product");
    }
  };

  return (
    <>
      <LoanProductForm
        onSubmit={
          editingProduct
            ? (productData) =>
                handleUpdateProduct(editingProduct.productId, productData)
            : handleCreateProduct
        }
        initialData={editingProduct}
      />
      <LoanProductList
        products={products}
        onEdit={setEditingProduct}
        onDeprecate={handleDeprecateProduct}
      />
    </>
  );
};

export default LoanProductsManagement;
