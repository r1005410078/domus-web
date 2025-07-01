"use client";

import {
  Snackbar,
  Alert,
  ColorPaletteProp,
  AlertPropsColorOverrides,
} from "@mui/joy";
import { OverridableStringUnion } from "@mui/types";
import React, { createContext, useContext, useState } from "react";

type ToastOptions = {
  message: string;
  severity?: OverridableStringUnion<ColorPaletteProp, AlertPropsColorOverrides>;
};

type ToastContextType = {
  showToast: (options: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<ToastOptions["severity"]>("success");

  const showToast = ({ message, severity = "success" }: ToastOptions) => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        color={severity}
        variant="solid"
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
      >
        {message}
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
