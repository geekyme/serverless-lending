"use client";

import { Toaster } from "react-hot-toast";

export const Toast = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: {
          background: "#363636",
          color: "#fff",
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: "green",
            secondary: "black",
          },
        },
        error: {
          duration: 3000,
          iconTheme: {
            primary: "red",
            secondary: "black",
          },
        },
      }}
    />
  );
};
