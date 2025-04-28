"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaCopyright } from "react-icons/fa";

const Footer = () => {
  const [quickLinksOpen, setQuickLinksOpen] = useState(false);

  const socialLinks = [
    { name: "Facebook", url: "https://facebook.com/utahfrenchchoir", img: "/facebook.png" },
    { name: "Twitter", url: "https://twitter.com/utahfrenchchoir", img: "/twitter.png" },
    { name: "Instagram", url: "https://instagram.com/utahfrenchchoir", img: "/instagram.png" },
    { name: "TikTok", url: "https://tiktok.com/utahfrenchchoir", img: "/tiktok.png" },
    { name: "YouTube", url: "https://youtube.com/utahfrenchchoir", img: "/youtube.png" }
  ];

  const quickLinks = [
    { name: "Members", href: "/components/Members" },
    { name: "Admins", href: "/components/Admins" },
    { name: "Affairs", href: "/components/Affaires" }
  ];

  return (
    <footer className="bg-teal-100 text-black w-full py-8 px-4 mt-10">
      <div className="max-w-6xl mx-auto">
        {/* Desktop Social Media Section */}
        <div className="hidden md:block mb-8">
          <div className="grid grid-cols-5 gap-6 justify-items-center">
            {socialLinks.map(({ name, url, img }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center group"
              >
                <div className="relative w-10 h-10 mb-2 transform transition-transform group-hover:scale-110">
                  <Image
                    src={img}
                    alt={name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                <span className="text-sm group-hover:underline">{name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Mobile Social Media Section */}
        <div className="md:hidden mb-8">
          <h2 className="text-base font-normal text-center mb-4">Follow Us on:</h2>
          <div className="flex justify-center items-center gap-4">
            {socialLinks.map(({ name, url, img }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="relative w-8 h-8 transform transition-transform group-hover:scale-110">
                  <Image
                    src={img}
                    alt={name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="flex flex-col items-center mb-8">
          <button
            onClick={() => setQuickLinksOpen(!quickLinksOpen)}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md transition-colors duration-200"
          >
            Quick Links {quickLinksOpen ? "▲" : "▼"}
          </button>
          
          <div className={`mt-2 w-48 transition-all duration-200 overflow-hidden ${quickLinksOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}>
            <ul className="bg-white rounded-md shadow-lg overflow-hidden">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="block px-4 py-2 hover:bg-green-600 text-black transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="flex justify-center items-center gap-2 text-sm">
          <FaCopyright />
          <span>{new Date().getFullYear()} Utah French Choir. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
