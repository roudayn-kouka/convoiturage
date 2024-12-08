import React from 'react';
import { ArrowRight } from 'lucide-react';

const ValueCard = ({ title, image, className }) => (
  <div className={`relative rounded-lg overflow-hidden ${className}`}>
    <img src={image} alt={title} className="w-full h-full object-cover" />
    <div className="absolute bottom-0 left-0 p-8">
      <h3 className="text-4xl font-bold text-white mb-4">{title}</h3>
      <button className="bg-[#00e676] text-black px-4 py-2 rounded-full flex items-center gap-2">
        Learn more <ArrowRight size={20} />
      </button>
    </div>
  </div>
);

const Values = () => {
  return (
    <section className="py-10 px-2 bg-[#f5f5f5]">
      <div className="text-center mb-4">
        <span className="bg-[#00897b] text-white px-4 py-1  rounded-full">Our values</span>
      </div>
      <h2 className="text-6xl font-bold text-center mb-16">
        The values that <span className="bg-[#00e676] px-2 ">light our path</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <ValueCard
          title="People"
          image="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&q=80"
          className="h-[400px]"
        />
        <ValueCard
          title="Purpose"
          image="https://images.unsplash.com/photo-1541976590-713941681591?auto=format&fit=crop&q=80"
          className="h-[400px]"
        />
        <ValueCard
          title="Performance"
          image="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80"
          className="h-[400px]"
        />
      </div>
    </section>
  );
};

export default Values;