import { ThemeContext } from "@/contexts/ThemeContext";
import { useContext } from "react";

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    throw new Error("userTheme deve ser usado dentro e <ThemeProvider>");
  return ctx;
}
