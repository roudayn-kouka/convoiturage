import React from 'react';
import { Wallet, Car, Globe } from 'lucide-react';

const NewsItem = ({ icon: Icon, date, category, title }) => (
  <div className="flex gap-4 items-start border-t py-4">
    <div className="bg-white p-2 rounded-lg">
      <Icon className="text-[#00897b]" size={24} />
    </div>
    <div>
      <div className="flex gap-4 items-center mb-2">
        <span className="border rounded-full px-3 py-1 text-sm">{category}</span>
        <span className="text-sm text-gray-600">{date}</span>
      </div>
      <h3 className="font-bold">{title}</h3>
    </div>
  </div>
);

const News = () => {
  return (
    <section className="py-10 px-2 bg-[#f5f5f5]">
      <div className="text-center mb-4">
        <span className="bg-[#00897b] text-white px-4 py-1 rounded-full">News</span>
      </div>
      <h2 className="text-6xl font-bold text-center mb-16">
        <span className="bg-[#00e676] px-2">Right now</span> at Merwe7a Merte7a 
      </h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <img 
            src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80" 
            alt="Film Festival" 
            className="w-full rounded-lg mb-4"
          />
          
        </div>

        <div>
          <NewsItem
            icon={Wallet}
            date="September 30"
            category="product"
            title="Merwe7a Merte7a expands its financial services offering, launches inDrive Money in Colombia"
          />
          <NewsItem
            icon={Car}
            date="September 19"
            category="product"
            title="Global Rideshare Leader Merwe7a Merte7a Announces Indianapolis as its First Midwest Market"
          />
          <NewsItem
            icon={Globe}
            date="September 24"
            category="corporate"
            title="Merwe7a Merte7a: Celebrating 5 billion deals (and counting!)"
          />
        </div>
      </div>
    </section>
  );
};

export default News;