/* ────────────────────────────────────────────────────────────
   AssetCard — reusable card for displaying a digital asset
   ────────────────────────────────────────────────────────────
   Props:
     asset.id          — number
     asset.name        — string
     asset.price       — string (ETH)
     asset.owner       — string (full or abbreviated address)
     asset.description — string (optional)
     asset.category    — string (optional)
     asset.image       — string (optional URL — falls back to gradient)
     currentUser       — string (wallet address of the logged-in user)
   ──────────────────────────────────────────────────────────── */

/* ── Category badge palette (muted, non-neon) ─────────────── */
const CATEGORY_STYLES = {
  Photography: "bg-bdam-primary-soft text-bdam-primary",
  Audio: "bg-purple-500/10 text-purple-400",
  Document: "bg-sky-500/10 text-sky-400",
  Design: "bg-amber-500/10 text-amber-400",
  Data: "bg-emerald-500/10 text-emerald-400",
  Video: "bg-rose-500/10 text-rose-400",
  Art: "bg-fuchsia-500/10 text-fuchsia-400",
};

const getCategoryStyle = (cat) =>
  CATEGORY_STYLES[cat] ?? "bg-bdam-surface text-bdam-muted";

/* ── Address formatter ────────────────────────────────────── */
const shortAddress = (addr) => {
  if (!addr || typeof addr !== "string") return "—";
  if (addr.length <= 13) return addr;                       // already short
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;           // 0xabcd…1234
};

/* ── Component ────────────────────────────────────────────── */
export default function AssetCard({ asset = {}, currentUser = "" }) {
  const {
    id = 0,
    name = "Untitled Asset",
    price = "0.00",
    owner,
    creator,
    description = "",
    category = "",
    image,
  } = asset;

  // Accept either `owner` or `creator` for the address
  const assetOwner = owner || creator || "";
  const displayAddress = shortAddress(assetOwner);

  // Ownership check — case-insensitive for Ethereum addresses
  const isOwner =
    currentUser.length > 0 &&
    assetOwner.length > 0 &&
    currentUser.toLowerCase() === assetOwner.toLowerCase();

  return (
    <div
      className={
        "group rounded-2xl border border-[#2C2E33] bg-bdam-surface-alt " +
        "p-5 flex flex-col gap-4 " +
        "transition-all duration-300 ease-out " +
        "hover:border-bdam-primary/40 hover:shadow-card " +
        "hover:-translate-y-1 hover:scale-[1.03]"
      }
    >
      {/* ── Thumbnail ── */}
      <div className="relative w-full aspect-[4/3] rounded-xl bg-bdam-surface overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          /* Abstract gradient placeholder — unique per id */
          <div
            className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity duration-300"
            style={{
              background: `linear-gradient(135deg,
                hsl(${(id * 47) % 360}, 35%, 18%) 0%,
                hsl(${(id * 47 + 60) % 360}, 25%, 12%) 100%)`,
            }}
          />
        )}

        {/* Category badge (only if provided) */}
        {category && (
          <span
            className={
              "absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider " +
              "px-2.5 py-1 rounded-lg backdrop-blur-sm " +
              getCategoryStyle(category)
            }
          >
            {category}
          </span>
        )}
      </div>

      {/* ── Info ── */}
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <h3 className="text-sm font-bold text-bdam-text truncate group-hover:text-white transition-colors">
          {name}
        </h3>
        {description && (
          <p className="text-xs text-bdam-muted line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between pt-3 border-t border-bdam-border">
        {/* Price */}
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-bdam-muted">
            Price
          </span>
          <span className="text-sm font-bold text-bdam-text">
            {price}{" "}
            <span className="text-[10px] font-semibold text-bdam-primary">ETH</span>
          </span>
        </div>

        {/* Owner / Creator */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-wider text-bdam-muted">
            Owner
          </span>
          <span className="text-xs font-mono text-bdam-label">
            {displayAddress}
          </span>
        </div>
      </div>

      {/* ── Buy / Owned button ── */}
      <button
        disabled={isOwner}
      onClick={() => {
        if (!isOwner) {
          console.log("Buy asset", id);
        }
      }}
      className={
        "w-full py-2.5 rounded-xl text-xs font-semibold tracking-wide " +
        "transition-all duration-200 " +
        (isOwner
          ? "bg-bdam-surface text-bdam-muted border border-bdam-border " +
          "opacity-50 cursor-not-allowed"
          : "bg-bdam-primary text-bdam-text border border-bdam-primary " +
          "hover:bg-bdam-primary-hov hover:border-bdam-primary-hov " +
          "hover:shadow-lg hover:shadow-bdam-primary/20 " +
          "active:scale-[0.985] cursor-pointer")
      }
      >
        {isOwner ? "Owned" : "Buy"}
      </button>
    </div>
  );
}
