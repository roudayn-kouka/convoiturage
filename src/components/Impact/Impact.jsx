import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const ImpactCard = ({ image, title, description }) => (
  <div className="flex flex-col gap-4">
    <img src={image} alt={title} className="w-full h-64 object-cover rounded-lg" />
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-gray-700">{description}</p>
    <button className="bg-[#00e676] text-black px-4 py-2 rounded-full w-fit">
      Learn more
    </button>
  </div>
);

const Impact = () => {
  return (
    <section className="py-10 px-2 bg-[#f5f5f5]">
      <div className="text-center mb-4">
        <span className="bg-[#00897b] text-white px-4 py-1 rounded-full">Impact</span>
      </div>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-6xl text-center font-bold mb-16" >
          Social impact: making <span className="bg-[#00e676] px-2">a difference</span>
        </h2>
        

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ImpactCard
            image="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80"
            title="A program that inspires young people to become change leaders"
            description="who will build a more sustainable, inclusive and just world"
          />
          <ImpactCard
            image="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80"
            title="Free undergraduate education for students from all backgrounds"
            description=""
          />
          <ImpactCard
            image="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80"
            title="A prize for women founders of IT startups"
            description="that have had the most significant developmental impact"
          />
        </div>
      </div>
    </section>
  );
};

export default Impact;