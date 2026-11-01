import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
// Your 12 campaigns. In CampaignSection.jsx change  `const campaigns`  to  `export const campaigns`
import { campaigns as sectionCampaigns } from "../components/home/CampaignSection";

/* ------------------------------------------------------------------ *
 *  TrustChain – Campaigns page
 *  Data sources (merged into one list):
 *   1. sectionCampaigns            – your 12 campaigns from CampaignSection.jsx
 *   2. extraCampaigns (prop)       – optional extra campaigns
 *   3. GET {API}/api/campaigns     – verified TrustChain campaigns (your backend)
 *   4. GET {API}/api/global-campaigns – worldwide NGO projects (GlobalGiving proxy)
 * ------------------------------------------------------------------ */

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CAUSES = [
  { id: "flood", label: "Flood", icon: "🌊", tint: "from-sky-500 to-cyan-600" },
  { id: "earthquake", label: "Earthquake", icon: "🏚️", tint: "from-amber-600 to-orange-700" },
  { id: "disaster", label: "Natural Disaster", icon: "🌪️", tint: "from-slate-500 to-slate-700" },
  { id: "water", label: "Clean Water", icon: "💧", tint: "from-blue-500 to-indigo-600" },
  { id: "education", label: "Education", icon: "📚", tint: "from-violet-500 to-purple-600" },
  { id: "orphans", label: "Orphan Children", icon: "🧒", tint: "from-pink-500 to-rose-600" },
  { id: "poverty", label: "Poverty", icon: "🍲", tint: "from-yellow-500 to-amber-600" },
  { id: "animals", label: "Animal Cruelty", icon: "🐾", tint: "from-orange-500 to-red-600" },
  { id: "air", label: "Clean Air", icon: "🌿", tint: "from-emerald-500 to-teal-600" },
];
const causeOf = (id) => CAUSES.find((c) => c.id === id) || { id: "other", label: "Other", icon: "🤝", tint: "from-emerald-600 to-green-700" };

// Guess a cause from free text (used for API data that has its own theme names)
function guessCause(text = "") {
  const t = text.toLowerCase();
  if (/flood/.test(t)) return "flood";
  if (/earthquake|quake/.test(t)) return "earthquake";
  if (/disaster|hurricane|cyclone|typhoon|wildfire|drought|tsunami|emergency|relief/.test(t)) return "disaster";
  if (/water|sanitation|hygiene/.test(t)) return "water";
  if (/education|school|girls|learning/.test(t)) return "education";
  if (/orphan|child|children|youth/.test(t)) return "orphans";
  if (/poverty|hunger|food|livelihood|economic|nutrition/.test(t)) return "poverty";
  if (/animal|wildlife|dog|cattle|cruelty/.test(t)) return "animals";
  if (/air|climate|environment|pollution|tree|forest/.test(t)) return "air";
  return "other";
}

/* ---------- Extra info for your 12 campaigns (cause / country / NGO) ---------- */
/* Keyed by the campaign id in CampaignSection.jsx. Country and cause are inferred
   from your titles and image names, so please check them. Fill in the real NGO names. */
const ENRICH = {
  1: { cause: "flood", country: "India", ngo: "" },
  2: { cause: "poverty", country: "Nigeria", ngo: "" },
  3: { cause: "education", country: "India", ngo: "CRY India" },
  4: { cause: "poverty", country: "United States", ngo: "" },
  5: { cause: "disaster", country: "Nepal", ngo: "" },
  6: { cause: "poverty", country: "Somalia", ngo: "" },
  7: { cause: "flood", country: "India", ngo: "" },
  8: { cause: "earthquake", country: "Japan", ngo: "" },
  9: { cause: "earthquake", country: "Turkey", ngo: "" },
  10: { cause: "flood", country: "Nepal", ngo: "" },
  11: { cause: "education", country: "India", ngo: "" },
  12: { cause: "poverty", country: "India", ngo: "The Akshaya Patra Foundation" },
};
const withInfo = (c) => ({ ...c, ...(ENRICH[c.id] || {}) });

/* ---------- Normalisers: turn any shape into one common shape ---------- */
const num = (v) => (v === undefined || v === null || v === "" || isNaN(Number(v)) ? 0 : Number(v));

function normaliseLocal(c, i, source = "trustchain") {
  const goal = c.goal_wei ? num(c.goal_wei) / 1e18 : num(c.goal ?? c.target ?? c.goalAmount);
  const raised = c.raised_wei ? num(c.raised_wei) / 1e18 : num(c.raised ?? c.collected ?? c.raisedAmount);
  const text = `${c.cause || ""} ${c.category || ""} ${c.title || c.name || ""}`;
  return {
    id: source === "featured" ? `site-${c.id ?? i}` : String(c.id ?? c.campaign_id ?? `${source}-${i}`),
    title: c.title || c.name || "Untitled campaign",
    summary: c.summary || c.description || "",
    ngo: c.ngo || c.organization || c.orgName || c.org_name || "TrustChain partner",
    country: c.country || c.location || "India",
    cause: CAUSES.some((x) => x.id === c.cause) ? c.cause : guessCause(text),
    goal,
    raised,
    currency: c.currency || "ETH",
    image: c.image || c.img || c.imageUrl || "",
    source,
    url: c.url || "",
    status: c.status || "Active",
  };
}

// GlobalGiving JSON -> common shape (field names from their API docs)
function normaliseGlobal(p) {
  const org = p.organization || {};
  return {
    id: `gg-${p.id}`,
    title: p.title,
    summary: p.summary || "",
    ngo: org.name || "Partner NGO",
    country: p.country || org.country || "Worldwide",
    cause: guessCause(`${p.themeName || ""} ${p.title || ""}`),
    goal: num(p.goal),
    raised: num(p.funding),
    currency: "USD",
    image: p.imageLink || "",
    source: "global",
    url: p.projectLink || "",
    status: "Active",
  };
}

async function getJson(url) {
  const r = await fetch(url, { headers: { Accept: "application/json" } });
  if (!r.ok) throw new Error(`${url} -> ${r.status}`);
  return r.json();
}

/* ------------------------------ UI pieces ------------------------------ */

function CampaignImage({ campaign, className = "" }) {
  const [failed, setFailed] = useState(false);
  const cause = causeOf(campaign.cause);
  if (!campaign.image || failed) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br ${cause.tint} text-white ${className}`}>
        <span className="text-6xl drop-shadow">{cause.icon}</span>
      </div>
    );
  }
  return <img src={campaign.image} alt={campaign.title} loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />;
}

function Progress({ raised, goal }) {
  const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
  return (
    <div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-emerald-100">
        <div className="h-full rounded-full bg-emerald-600" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 text-xs text-gray-600">{pct}% funded</div>
    </div>
  );
}

const money = (n, cur) => (cur === "USD" ? `$${Math.round(n).toLocaleString()}` : `${Number(n.toFixed(2))} ${cur}`);

function Card({ c, onOpen, onDonate }) {
  const cause = causeOf(c.cause);
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-emerald-100 transition hover:shadow-md">
      <button onClick={() => onOpen(c)} className="text-left">
        <div className="relative">
          <CampaignImage campaign={c} className="h-44 w-full" />
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-emerald-900">
            {cause.icon} {cause.label}
          </span>
          {c.source === "trustchain" && (
            <span className="absolute right-3 top-3 rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white">Verified on-chain</span>
          )}
        </div>
      </button>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-emerald-950">{c.title}</h3>
        <p className="text-sm text-gray-600">
          {c.ngo} · {c.country}
        </p>
        <p className="line-clamp-2 text-sm text-gray-500">{c.summary}</p>
        <div className="mt-auto space-y-3">
          {c.goal > 0 && (
            <>
              <Progress raised={c.raised} goal={c.goal} />
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-emerald-900">{money(c.raised, c.currency)} raised</span>
                <span className="text-gray-500">of {money(c.goal, c.currency)}</span>
              </div>
            </>
          )}
          <div className="flex gap-2">
            <button onClick={() => onDonate(c)} className="flex-1 rounded-lg bg-emerald-700 px-4 py-2.5 font-semibold text-white hover:bg-emerald-800">
              Donate
            </button>
            <button onClick={() => onOpen(c)} className="rounded-lg border border-emerald-700 px-4 py-2.5 font-semibold text-emerald-800 hover:bg-emerald-50">
              Details
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function Modal({ c, onClose, onDonate }) {
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  if (!c) return null;
  const cause = causeOf(c.cause);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
        <CampaignImage campaign={c} className="h-60 w-full" />
        <div className="space-y-4 p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-extrabold text-emerald-950">{c.title}</h2>
            <button onClick={onClose} aria-label="Close" className="rounded-full px-3 py-1 text-xl text-gray-500 hover:bg-gray-100">×</button>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-900">{cause.icon} {cause.label}</span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">🏢 {c.ngo}</span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">📍 {c.country}</span>
          </div>
          <p className="whitespace-pre-line text-gray-700">{c.summary || "No description provided."}</p>
          {c.goal > 0 && (
            <div className="space-y-2">
              <Progress raised={c.raised} goal={c.goal} />
              <p className="text-sm text-gray-700">
                <b>{money(c.raised, c.currency)}</b> raised of {money(c.goal, c.currency)}
              </p>
            </div>
          )}
          {c.source === "global" && (
            <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
              This project is hosted by a partner platform. Donating opens their secure page; it is not recorded on the TrustChain blockchain.
            </p>
          )}
          <button onClick={() => onDonate(c)} className="w-full rounded-lg bg-emerald-700 py-3 font-semibold text-white hover:bg-emerald-800">
            {c.source === "global" ? "Donate on partner site" : "Donate to this campaign"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ The page ------------------------------ */

export default function CampaignsPage({ extraCampaigns = [], onDonate }) {
  const navigate = useNavigate();
  const [remote, setRemote] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const [query, setQuery] = useState("");
  const [cause, setCause] = useState("all");
  const [ngo, setNgo] = useState("");
  const [country, setCountry] = useState("all");
  const [source, setSource] = useState("all");
  const [sort, setSort] = useState("relevant");
  const [visible, setVisible] = useState(9);
  const [open, setOpen] = useState(null);

  // Load backend + worldwide campaigns. Failures are non-fatal.
  useEffect(() => {
    let alive = true;
    (async () => {
      const [tc, gg] = await Promise.allSettled([getJson(`${API}/api/campaigns`), getJson(`${API}/api/global-campaigns`)]);
      if (!alive) return;
      const out = [];
      const msgs = [];
      if (tc.status === "fulfilled") {
        const rows = Array.isArray(tc.value) ? tc.value : tc.value.campaigns || [];
        out.push(...rows.map((c, i) => normaliseLocal(c, i, "trustchain")));
      } else msgs.push("TrustChain backend not reachable");
      if (gg.status === "fulfilled") {
        const rows = gg.value?.projects?.project || gg.value?.projects || [];
        out.push(...(Array.isArray(rows) ? rows : [rows]).map(normaliseGlobal));
      } else msgs.push("worldwide NGO feed not connected");
      setRemote(out);
      setNotice(msgs.length ? `Showing local campaigns only (${msgs.join(", ")}).` : "");
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  const all = useMemo(() => {
    const local = [...sectionCampaigns.map(withInfo), ...extraCampaigns].map((c, i) => normaliseLocal(c, i, "featured"));
    const seen = new Set();
    return [...local, ...remote].filter((c) => (seen.has(c.id) ? false : seen.add(c.id)));
  }, [remote, extraCampaigns]);

  const ngos = useMemo(() => [...new Set(all.map((c) => c.ngo))].sort(), [all]);
  const countries = useMemo(() => [...new Set(all.map((c) => c.country))].sort(), [all]);
  const countByCause = useMemo(() => {
    const m = {};
    all.forEach((c) => (m[c.cause] = (m[c.cause] || 0) + 1));
    return m;
  }, [all]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let r = all.filter((c) => {
      if (cause !== "all" && c.cause !== cause) return false;
      if (country !== "all" && c.country !== country) return false;
      if (source === "trustchain" && c.source === "global") return false;
      if (source === "global" && c.source !== "global") return false;
      if (ngo && !c.ngo.toLowerCase().includes(ngo.trim().toLowerCase())) return false;
      if (q && !`${c.title} ${c.summary} ${c.ngo} ${c.country} ${causeOf(c.cause).label}`.toLowerCase().includes(q)) return false;
      return true;
    });
    const pct = (c) => (c.goal ? c.raised / c.goal : 0);
    if (sort === "funded") r = [...r].sort((a, b) => pct(b) - pct(a));
    if (sort === "needed") r = [...r].sort((a, b) => pct(a) - pct(b));
    if (sort === "az") r = [...r].sort((a, b) => a.title.localeCompare(b.title));
    return r;
  }, [all, query, cause, country, source, ngo, sort]);

  useEffect(() => setVisible(9), [query, cause, country, source, ngo, sort]);

  const donate = (c) => {
    if (onDonate) return onDonate(c);
    if (c.source === "global" && c.url) return window.open(c.url, "_blank", "noopener");
    navigate(`/donate?campaign=${encodeURIComponent(c.id)}`);
  };

  const clear = () => { setQuery(""); setCause("all"); setNgo(""); setCountry("all"); setSource("all"); setSort("relevant"); };
  const filtersActive = query || cause !== "all" || ngo || country !== "all" || source !== "all";

  const field = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200";

  return (
    <main className="min-h-screen bg-emerald-50">
      {/* Header + search */}
      <section className="bg-gradient-to-b from-emerald-100 to-emerald-50 px-4 pb-8 pt-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-extrabold text-emerald-950 sm:text-5xl">Campaigns</h1>
          <p className="mt-2 max-w-2xl text-gray-700">
            Find a cause, an NGO or a country, and donate with confidence. Browse {all.length}+ campaigns from India and around the world.
          </p>
          <div className="mt-6 flex max-w-3xl overflow-hidden rounded-xl bg-white shadow ring-1 ring-emerald-200 focus-within:ring-2 focus-within:ring-emerald-600">
            <span className="flex items-center pl-4 text-gray-400">🔍</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search campaigns, e.g. “earthquake relief”, “clean water”, an NGO…"
              className="w-full px-3 py-4 outline-none"
              aria-label="Search campaigns"
            />
            {query && <button onClick={() => setQuery("")} className="px-4 text-gray-500 hover:text-gray-800" aria-label="Clear search">×</button>}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-16">
        {/* Cause chips */}
        <div className="-mx-1 flex flex-wrap gap-2 py-4">
          <button onClick={() => setCause("all")} className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 ${cause === "all" ? "bg-emerald-700 text-white ring-emerald-700" : "bg-white text-emerald-900 ring-emerald-200 hover:bg-emerald-100"}`}>
            All causes
          </button>
          {CAUSES.map((c) => (
            <button key={c.id} onClick={() => setCause(cause === c.id ? "all" : c.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 ${cause === c.id ? "bg-emerald-700 text-white ring-emerald-700" : "bg-white text-emerald-900 ring-emerald-200 hover:bg-emerald-100"}`}>
              {c.icon} {c.label} <span className="opacity-60">({countByCause[c.id] || 0})</span>
            </button>
          ))}
        </div>

        {/* Dropdown filters */}
        <div className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-emerald-100 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="mb-1 block text-xs font-semibold text-emerald-900">NGO / organisation</label>
            <input list="ngo-list" value={ngo} onChange={(e) => setNgo(e.target.value)} placeholder="Type or pick an NGO" className={field} />
            <datalist id="ngo-list">{ngos.map((n) => <option key={n} value={n} />)}</datalist>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-emerald-900">Country</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className={field}>
              <option value="all">All countries</option>
              {countries.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-emerald-900">Source</label>
            <select value={source} onChange={(e) => setSource(e.target.value)} className={field}>
              <option value="all">All campaigns</option>
              <option value="trustchain">TrustChain campaigns</option>
              <option value="global">Worldwide NGOs</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-emerald-900">Sort by</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className={field}>
              <option value="relevant">Featured</option>
              <option value="needed">Most needed</option>
              <option value="funded">Closest to goal</option>
              <option value="az">A to Z</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={clear} disabled={!filtersActive} className="w-full rounded-lg border border-emerald-700 px-3 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 disabled:opacity-40">
              Clear filters
            </button>
          </div>
        </div>

        {notice && <p className="mt-4 rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-900">{notice}</p>}

        <p className="mb-4 mt-6 text-sm text-gray-600" aria-live="polite">
          {loading ? "Loading campaigns…" : `${results.length} campaign${results.length === 1 ? "" : "s"} found`}
        </p>

        {/* Grid */}
        {results.length === 0 && !loading ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <p className="text-lg font-semibold text-emerald-950">No campaigns match your search</p>
            <p className="mt-1 text-gray-600">Try a different keyword or clear some filters.</p>
            <button onClick={clear} className="mt-4 rounded-lg bg-emerald-700 px-5 py-2.5 font-semibold text-white hover:bg-emerald-800">Clear filters</button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.slice(0, visible).map((c) => <Card key={c.id} c={c} onOpen={setOpen} onDonate={donate} />)}
          </div>
        )}

        {visible < results.length && (
          <div className="mt-10 text-center">
            <button onClick={() => setVisible((v) => v + 9)} className="rounded-full border-2 border-emerald-700 px-8 py-3 font-semibold text-emerald-800 hover:bg-emerald-100">
              View more
            </button>
          </div>
        )}
      </div>

      <Modal c={open} onClose={() => setOpen(null)} onDonate={donate} />
    </main>
  );
}

