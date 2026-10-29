import React from "react";

const donors = [
  { name: "Shasshikant Joshi", amount: 1000 },
  { name: "Rohit Sharma", amount: 5665 },
  { name: "Priya Verma", amount: 500 },
  { name: "Amit Kumar", amount: 2100 },
  { name: "Sneha Gupta", amount: 11000 },
  { name: "Rahul Singh", amount: 251 },
  { name: "Anjali Mishra", amount: 3000 },
  { name: "Vikas Yadav", amount: 750 },
  { name: "Neha Patel", amount: 1500 },
  { name: "Arjun Reddy", amount: 25000 },
  { name: "Pooja Tiwari", amount: 101 },
  { name: "Manish Pandey", amount: 4500 },
];

const formatINR = (n) => "₹" + n.toLocaleString("en-IN");

const DonationTicker = () => {
  // List is repeated twice so the loop looks seamless
  const items = [...donors, ...donors];

  return (
    <div className="w-full overflow-hidden bg-rose-50 py-8">
      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ticker-track {
          display: flex;
          width: max-content;
          animation: ticker-scroll 40s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="ticker-track">
        {items.map((d, i) => (
          <div key={i} className="flex items-center whitespace-nowrap">
            <span className="text-2xl md:text-4xl font-medium text-gray-900">
              {d.name} just donated{" "}
              <span className="font-bold text-red-500">
                {formatINR(d.amount)}
              </span>
            </span>
            <span className="mx-8 text-2xl md:text-4xl text-gray-800">✱</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonationTicker;