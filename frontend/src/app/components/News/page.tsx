"use client";

import React, { useState } from "react";
import { Play} from "lucide-react";

// Define a proper interface for video objects
interface Video {
  id: string;
  title: string;
  videoId: string;
  thumbnailUrl: string;
}

// Updated video data with YouTube video IDs
const videos: Video[] = [
  {
    id: "1",
    title: "Utah French Choir - Performance 1",
    videoId: "4kR4B08TiBA",
    thumbnailUrl: `https://img.youtube.com/vi/4kR4B08TiBA/hqdefault.jpg`,
  },
  {
    id: "2",
    title: "Utah French Choir - Performance 2",
    videoId: "r3lSd1HERoE",
    thumbnailUrl: `https://img.youtube.com/vi/3lSd1HERoE/hqdefault.jpg`,
  },

];

export default function NewsPage() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const toggleVideo = (videoId: string) => {
    setActiveVideo(activeVideo === videoId ? null : videoId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Utah French Choir News</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div 
            key={video.id} 
            className="bg-gray-100 shadow-lg rounded-lg overflow-hidden relative group"
          >
            <div className="relative w-full pt-[56.25%]">
              {activeVideo === video.id ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=0`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div 
                  className="absolute inset-0 bg-cover bg-center cursor-pointer"
                  style={{ backgroundImage: `url(${video.thumbnailUrl})` }}
                  onClick={() => toggleVideo(video.id)}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <Play className="text-white w-16 h-16 opacity-80 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold">{video.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}