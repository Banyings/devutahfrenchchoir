"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DollarSign, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when pathname changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-teal-100 text-black border-slate-600">
        <div className="flex items-center justify-between px-6 py-3 mx-auto max-w-7xl">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Image src="/logo.png" alt="Utah French Choir" width={100} height={80} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 text-lg border border-gray-950 rounded-full p-1">
            <Link
              href="/"
              className={`px-6 py-2 rounded-full transition-all duration-300 hover:bg-green-500 ${
                pathname === "/" ? "bg-green-600" : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/components/About"
              className={`px-6 py-2 rounded-full transition-all duration-300 hover:bg-green-500 ${
                pathname === "/components/About" ? "bg-green-600" : ""
              }`}
            >
              About
            </Link>
            <Link
              href="/components/News"
              className={`px-6 py-2 rounded-full transition-all duration-300 hover:bg-green-500 ${
                pathname === "/components/News" ? "bg-green-600" : ""
              }`}
            >
              News
            </Link>
            <Link
              href="/components/Book-us"
              className={`px-6 py-2 rounded-full transition-all duration-300 hover:bg-green-500 ${
                pathname === "/components/Book-us" ? "bg-green-600" : ""
              }`}
            >
              Book Us
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/components/Donate" className="hidden md:block">
              <button className="flex items-center bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors duration-300">
                <DollarSign size={18} className="mr-1" />
                Donate
              </button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden hover:opacity-80 transition-opacity duration-300"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden shadow-lg transition-all duration-300 ease-in-out bg-teal-100">
            <div className="py-2 px-4 space-y-2">
              <Link href="/">
                <div className={`block px-4 mt-1 mb-1 py-2 rounded-md transition-colors duration-300 ${
                  pathname === "/" ? "bg-green-600" : "hover:bg-green-500"
                }`}>
                  Home
                </div>
              </Link>
              <Link href="/components/About">
                <div className={`block px-4 py-2 mt-1 mb-1 rounded-md transition-colors duration-300 ${
                  pathname === "/components/About" ? "bg-green-600" : "hover:bg-green-500"
                }`}>
                  About
                </div>
              </Link>
              <Link href="/components/News">
                <div className={`block px-4 py-2 mt-1 mb-1 rounded-md transition-colors duration-300 ${
                  pathname === "/components/News" ? "bg-green-600 text-white" : "hover:bg-green-500"
                }`}>
                  News
                </div>
              </Link>
              <Link href="/components/Book-us">
                <div className={`block px-4 py-2 mt-1 mb-1 rounded-md transition-colors duration-300 ${
                  pathname === "/components/Book-us" ? "bg-green-600 text-white" : "hover:bg-green-500"
                }`}>
                  Book Us
                </div>
              </Link>
              <Link href="/components/Donate">
                <div className="flex items-center px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors duration-300">
                  <DollarSign size={18} className="mr-1" />
                  Donate
                </div>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer div */}
      <div className={`h-24 ${isMenuOpen ? 'md:h-24 h-64' : 'h-24'}`} />
    </div>
  );
}
