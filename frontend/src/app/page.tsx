
'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email.');
      setMessageType('error');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Subscribed successfully!');
        setMessageType('success');
        setEmail('');
      } else {
        setMessage(data.error || 'Subscription failed.');
        setMessageType('error');
      }
    } catch {
      setMessage('Server error. Please try again later.');
      setMessageType('error');
    }
  };

  // Leads to the Join-Us Page
  const navigateToJoinUs = () => {
    router.push('/components/Join-us');
  };
  

  return (
    <div className="max-w-auto mx-auto px-4 py-8">
      {/* Hero Section Section  */}
      <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to Utah French Choir</h1>
          <div className="space-y-4">
            <p className="text-lg font-medium mb-4">
              We combine cultures to enhance our voices together and our testimonies of the Lord. We sing for God and for others to join and become better.
            </p>
            <button
              className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition-colors"
              onClick={navigateToJoinUs}
            >
              Join-Us
            </button>
          </div>
        </div>
        <div className="relative w-full aspect-[4/2] rounded-lg overflow-hidden">
          <Image
            src="/choir-group.png"
            alt="Choir group"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <FeatureCard
          imageSrc="/choir-group.png"
          description="Hey my name is Marjorie Badibanga. I love Singing"
          buttonLabel="Visit Us"
          buttonLink="/components/Visit-us"
          router={router}
        />
        <FeatureCard
          imageSrc="/choir-group.png"
          description="Come visit Us. We are so happy to have you sing with us!"
          buttonLabel="Learn more"
          buttonLink="/components/About"
          router={router}
        />
        <FeatureCard
          imageSrc="/choir-group.png"
          description="Nurturing Nations. An activity at Salem Utah"
          buttonLabel="Activity"
          buttonLink="/components/Activity"
          router={router}
        />
      </div>

      {/* subscribe Section  */}
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Stay Updated</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="email"
            placeholder="email-address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 border-black"
            aria-label="Email address"
          />
          <button
            className="bg-green-600 text-white px-8 py-2 rounded-md hover:bg-green-700 transition-colors whitespace-nowrap"
            onClick={handleSubscribe}
          >
            Subscribe Now
          </button>
        </div>
        {message && (
          <p className={`mt-4 ${messageType === 'success' ? 'text-green-700' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;

// --- Feature Card Component ---
interface FeatureCardProps {
  imageSrc: string;
  description: string;
  buttonLabel: string;
  buttonLink: string;
  router: ReturnType<typeof useRouter>;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ imageSrc, description, buttonLabel, buttonLink, router }) => {
  return (
    <div className="p-6 rounded-lg border border-neutral-950">
      <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
        <Image
          src={imageSrc}
          alt="Feature Image"
          fill
          className="object-cover"
          sizes="128px"
        />
      </div>
      <p className="text-center">{description}</p>
      <button
        className="w-full bg-green-600 text-white py-2 rounded-md mt-4 hover:bg-green-700 transition-colors"
        onClick={() => router.push(buttonLink)}
      >
        {buttonLabel}
      </button>
    </div>
  );
};