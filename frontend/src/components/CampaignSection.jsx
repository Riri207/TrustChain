
const campaigns = [
  {
    id: 1,
    image: "/images/assam flood.png",
    category: "FLOOD RELIEF",
    title: "Assam Flood Response 2025",
    description:
      "Support flood-affected families in Assam with essential supplies and community relief efforts.",
  },
  {
    id: 2,
    image: "/images/child nutrition nigeria.png",
    category: "NUTRITION",
    title: "Child nutrition and emergency support",
    description:
      "Support initiatives creating healthcare for children.",
  },
  {
    id: 3,
    image: "/images/Cry india.png",
    category: "CHILDREN`S WELLFARE,EDUCATION AND PROTECTION",
    title: "Children welllfare and eduaction",
    description:
      "Campaigns include returning children to school, girls' education, child rights and health and nutrition",
  },
  {
    id: 4,
    image: "/images/kids usa.png",
    category: "FOOD SUPPORT",
    title: "Food & Essentials",
    description:
      "Support relief efforts providing food and everyday necessities.",
  },
  {
    id: 5,
    image: "/images/nepal flood.png",
    category: "DISASTER RELIEF",
    title: "Disaster management and volunteer assistance ",
    description:
      "Explore initiatives connecting families in crisis with relief support.",
  },
  {
    id: 6,
    image: "/images/somalia food.png",
    category: "EMERGENCY FOOD SUPPORT",
    title: "Emergency food support and assisatance  to those in need ",
    description:
      "Discover initiatives working to improve well-being of somalians .",
  },
];

export default function CampaignSection({ onSelectCampaign }) {
  return (
    <section
      id="campaigns"
      className="bg-emerald-50/60 px-5 py-16 sm:px-8 lg:px-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
            MAKE A DIFFERENCE
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl">
            Support a Cause You Believe In
          </h2>

          <p className="mt-4 text-base leading-7 text-emerald-900/70">
            Explore campaigns, learn about their purpose, and make informed
            decisions through TrustChain.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <article
              key={campaign.id}
              className="group overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-xl"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  onError={(e) => {
                    e.currentTarget.alt = `${campaign.title} image unavailable`;
                  }}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold tracking-wide text-emerald-800 shadow-sm">
                  {campaign.category}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold text-emerald-950 transition group-hover:text-emerald-700">
                  {campaign.title}
                </h3>

                <p className="mt-3 min-h-[72px] text-sm leading-6 text-gray-600">
                  {campaign.description}
                </p>

                <div className="mt-5 border-t border-emerald-100 pt-4">
                  <button
                    type="button"
                    onClick={() => onSelectCampaign(campaign)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    View Details & Donate
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
