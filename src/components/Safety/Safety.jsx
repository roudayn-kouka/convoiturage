import React from 'react';
import { CircleDot } from 'lucide-react';

const Safety = () => {
  return (
    <section className="py-10 px-2 bg-[#f5f5f5]">
      <div className="text-center mb-4">
        <span className="bg-[#00897b] text-white px-4 py-1 rounded-full pb-30">Safety</span>
      </div>
      <h2 className="text-6xl font-bold text-center mb-4">
        Your safety is <span className="bg-[#00e676] px-2">our priority</span>
      </h2>
      <p className="text-center text-xl mb-16">Stay on the safe side with Merwe7a Merte7a</p>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="relative">
          <div className="absolute -z-10 bg-[#c6f135] w-[80%] h-[80%] rounded-full"></div>
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80" 
            alt="Safety" 
            className="w-[80%] rounded-lg"
          />
        </div>
        <div>
          <h3 className="text-7xl font-bold mb-6">
            We want all of us to be on the same page about safety
          </h3>
          <p className="text-xl mb-8">
            And so, we're calling this page our safety pact – a 3-sided alliance between passengers, drivers and inDrive, with mutual responsibilities for every single ride
          </p>
          <button className="bg-[#00e676] text-black px-6 py-3 rounded-full">
            Learn more
          </button>
          
        </div>
      </div>
    </section>
  );
};

export default Safety;