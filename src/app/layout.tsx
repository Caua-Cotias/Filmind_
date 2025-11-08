import type { Metadata } from "next";
import { Nunito } from "next/font/google";


import "../styles/globals.css";


const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Filmind +",
  description: "Entreteniment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${nunito.variable} antialiased font-sans dark overflow-y-scroll overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
