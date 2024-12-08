import React from 'react';

const ValueCard = ({ title, image, className }) => (
  <div className={`relative rounded-lg overflow-hidden ${className}`}>
    <img src={image} alt={title} className="w-full h-full object-cover" />
    <div className="absolute bottom-0 left-0 p-8">
      <h3 className="text-4xl font-bold text-white mb-0">{title}</h3>
    </div>
  </div>
);

const Values = () => {
  return (
    <section className="py-10 px-2 bg-[#f5f5f5]">
  <h2 className="text-6xl font-bold text-center mb-16">
    Our <span className="bg-[#00e676] px-2 ">team</span>
  </h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto py-15">
    <ValueCard
      title="Sahar Saidani"
      image="https://media.licdn.com/dms/image/v2/D4E03AQEe4j4LbDCmMQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1689079513776?e=2147483647&v=beta&t=vlAJDpDFVRlap_58u_231uYjTqtZ8iNDvXdQ3alyRUc"
      className="h-[350px] w-[300px] mx-auto"
    />
    <ValueCard
      title="Roudayna Kouka"
      image="https://media.licdn.com/dms/image/v2/D4D03AQHL_m9W-ODK_A/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1718267929761?e=2147483647&v=beta&t=HzxymTJDEZFTRhxk-RsegFx54OL8zepaEPZFO9qK3ig"
      className="h-[350px] w-[300px] mx-auto"
    />
    <ValueCard
      title="Alaa Chaar"
      image="https://media.licdn.com/dms/image/v2/D4E03AQF-yPdf3emMbw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1728202262593?e=2147483647&v=beta&t=zIacn4HOblGt229kA8THFkY_8IFcjxsyJvR7tgQqw4o"
      className="h-[350px] w-[300px] mx-auto"
    />
    <ValueCard
      title="Fida Ghourabi"
      image="https://media.licdn.com/dms/image/v2/D4E03AQGlXN-XGmBk9w/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1696712497085?e=2147483647&v=beta&t=dI0RcqPRK-6hMga-DkHVNY6mEgJ3edAx4jKaE74i41c"
      className="h-[350px] w-[300px] mx-auto"
    />
  </div>
</section>
  );
};

export default Values;