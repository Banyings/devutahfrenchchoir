import type { Metadata } from "next";
import Navbar from "./components/Navbar/page";
import Footer from "./components/Footer/page";
import "./globals.css";

export const metadata: Metadata = {
  title: "Utah French Choir Web App",
  description: "Web App for Utah French Choir",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
