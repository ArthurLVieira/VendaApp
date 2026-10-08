import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import "bulma/bulma.scss"

export const metadata: Metadata = {
  title: {
    default: "Vendas",
    template: "%s | Vendas"
  },
  description: "aplicação de vendas",
};

type RootLayoutProps = {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
