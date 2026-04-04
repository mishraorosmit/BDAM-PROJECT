import { useState } from "react";
import { Link } from "react-router-dom";
import AssetCard from "../components/AssetCard";

/* ────────────────────────────────────────────────────────────
   Mock asset data — no API, no blockchain
   ──────────────────────────────────────────────────────────── */
const assets = [
  {
    id: 1,
    name: "Abstract Block",
    price: "0.1",
    owner: "0xabc123...",
  },
  {
    id: 2,
    name: "Digital Vault",
    price: "0.2",
    owner: "0xdef456...",
  },
  {
    id: 3,
    name: "Encrypted Node",
    price: "0.3",
    owner: "0xghi789...",
  }
];

/* ────────────────────────────────────────────────────────────
   Marketplace Page
   ──────────────────────────────────────────────────────────── */
export default function Marketplace() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const currentUser = "0xabc123...";

  /* Unique categories from data (filtering out undefined) */
  const categories = ["All", ...new Set(assets.map((a) => a.category).filter(Boolean))];

  /* Filter logic */
  const filteredAssets = assets.filter((asset) => {
    const matchesCategory = activeCategory === "All" || asset.category === activeCategory;
    const matchesSearch =
      search.trim() === "" ||
      (asset.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (asset.description || "").toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-bdam-bg px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-bdam-text">
              Marketplace
            </h1>
            <p className="text-sm text-bdam-muted">
              Browse, discover, and acquire verified digital assets.
            </p>
          </div>

          <Link
            to="/upload"
            className={
              "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold " +
              "bg-bdam-primary text-bdam-text " +
              "hover:bg-bdam-primary-hov hover:scale-[1.02] " +
              "active:scale-[0.98] " +
              "transition-all duration-200 shadow-lg shadow-bdam-primary/20 " +
              "self-start sm:self-auto"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Upload Asset
          </Link>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-bdam-muted pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 110-16 8 8 0 010 16z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e?.target?.value ?? "")}
              className={
                "w-full rounded-xl bg-bdam-surface border border-bdam-border " +
                "pl-10 pr-4 py-2.5 text-sm text-bdam-text placeholder-bdam-muted " +
                "outline-none transition-all duration-200 " +
                "focus:ring-2 focus:ring-bdam-primary focus:border-bdam-primary"
              }
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={
                  "px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide " +
                  "border transition-all duration-200 " +
                  (activeCategory === cat
                    ? "bg-bdam-primary border-bdam-primary text-bdam-text shadow-md shadow-bdam-primary/15"
                    : "bg-bdam-surface border-bdam-border text-bdam-muted " +
                      "hover:border-bdam-primary/40 hover:text-bdam-text")
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div className="flex items-center justify-between text-xs text-bdam-muted">
          <span>
            Showing{" "}
            <span className="font-semibold text-bdam-text">{filteredAssets.length}</span>{" "}
            {filteredAssets.length === 1 ? "asset" : "assets"}
          </span>
          {(search || activeCategory !== "All") && (
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="text-bdam-primary hover:text-bdam-text transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* ── Grid ── */}
        {filteredAssets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} currentUser={currentUser} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-bdam-surface flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-bdam-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0
                     01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0
                     00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1
                     1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-bdam-text">No assets available</p>
            <p className="text-xs text-bdam-muted mt-1">
              Try adjusting your search or category filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
