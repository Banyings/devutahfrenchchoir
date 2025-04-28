'use client'
import Image from "next/image";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const images = [
  "/choir-group.png",
  "/malau.png"
];

export default function About() {
  const [currentImage, setCurrentImage] = useState(0);

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 text-center">
      <h2 className="text-3xl font-bold">Direction</h2>
      <p>Choir President: Francis Badibanga</p>
      <p>Music Directors: Serge Nzakonde, Joli Haboko, Benjamin Lukonga</p>
      <p>Assistants: Sue Winmill, Jenny</p>
      <p>Developers and Technicians: Hyppolite Banyinge, Bernadi Kola, Eriel Nyengo</p>
      <p>Pianists: Arthur Lono, Huggens Tshibanda</p>

      <h2 className="text-3xl font-bold ">Choir Members</h2>
      <p>
        Our members come from various countries including the Democratic Republic
        of the Congo (DRC), Canada, the United States, Ivory Coast, and France.
        We sing in French but can also perform in Tshiluba, Swahili, English, and
        other languages as requested.
      </p>

      <div className="relative w-full max-w-lg mx-auto">
        <button onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 text-white p-2 rounded-full">
          <FaChevronLeft />
        </button>
        <Image src={images[currentImage]} alt="Choir" width={600} height={400} className="rounded-lg" />
        <button onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 text-white p-2 rounded-full">
          <FaChevronRight />
        </button>
      </div>

      <h2 className="text-3xl font-bold ">History of Utah French Choir</h2>
      <p>
        We began singing in an apartment building in 2018 to praise God, with no
        initial intentions of performing. A year later, we started sharing our
        passion more widely. <a href="/components/Blog" className="text-blue-600 underline">Visit our blog</a> to learn more.
      </p>
    </div>
  );
}