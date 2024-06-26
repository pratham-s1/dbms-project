import { Inter } from "next/font/google";

import "./globals.css";
import MainWrapper from "./components/MainWrapper";
import { Provider } from "react-redux";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RailEz",
  description: "Railway booking made easy!",
  icon: "/logo.svg",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MainWrapper>{children}</MainWrapper>
      </body>
    </html>
  );
}
