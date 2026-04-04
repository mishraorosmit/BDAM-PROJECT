/* Profile Page Component */

const uploads = [
  { id: 1, name: "My Asset 1", cid: "Qm123...", price: "0.1" },
  { id: 2, name: "My Asset 2", cid: "Qm456...", price: "0.2" }
];

const owned = [
  { id: 3, name: "Owned Asset 1", cid: "Qm789...", price: "0.3" }
];

export default function Profile() {
  const wallet = "0xAb12...7f3d";

  return (
    <div className="min-h-screen bg-bdam-bg text-bdam-text p-6">
      <div className="max-w-7xl mx-auto w-full space-y-12">
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-bdam-text">Profile</h1>
            <p className="text-sm text-bdam-muted mt-2">Manage your assets and uploads.</p>
          </div>
          
          {/* ── Wallet Card ── */}
          <div className="bg-bdam-surface p-4 rounded-xl border border-bdam-border flex items-center shadow-lg min-w-[240px] justify-center">
            {wallet ? (
              <div className="flex items-center gap-3 w-full">
                <div className="w-8 h-8 rounded-full bg-bdam-primary flex items-center justify-center shadow-inner shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-bdam-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-bdam-muted">
                    Connected Wallet
                  </span>
                  <span className="text-sm font-mono font-medium text-bdam-text tracking-tight">
                    {wallet}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-sm text-bdam-muted font-medium text-center w-full opacity-80">
                Wallet not connected
              </span>
            )}
          </div>
        </div>

        {/* ── Section 1: Your Uploads ── */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-6 text-bdam-text">Your Uploads</h2>
          
          {/* Grid Container */}
          {uploads.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploads.map((asset) => (
                <div key={asset.id} className="bg-bdam-surface rounded-xl p-5 shadow-lg border border-bdam-border flex flex-col gap-3 transition-transform duration-300 hover:scale-105">
                  <h3 className="font-bold text-bdam-text truncate">{asset.name}</h3>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-bdam-muted">CID</span>
                    <span className="font-mono text-bdam-muted">{asset.cid.slice(0, 8)}...</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs pt-3 mt-1 border-t border-bdam-border">
                    <span className="text-bdam-muted uppercase tracking-wider text-[10px]">Price</span>
                    <span className="font-bold text-bdam-text">
                      {asset.price} <span className="text-bdam-primary text-[10px]">ETH</span>
                    </span>
                  </div>
                  {asset.cid ? (
                    <a
                      href={`https://gateway.pinata.cloud/ipfs/${asset.cid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full mt-2 flex items-center justify-center border border-bdam-primary text-bdam-primary hover:bg-bdam-primary hover:text-bdam-text transition-colors py-2 rounded-lg text-xs font-semibold active:scale-[0.98]"
                    >
                      View on IPFS
                    </a>
                  ) : (
                    <button disabled className="w-full mt-2 border border-bdam-border py-2 rounded-lg text-xs font-semibold text-bdam-muted opacity-50 cursor-not-allowed">
                      CID Unavailable
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="col-span-full py-16 flex flex-col items-center justify-center border border-dashed border-bdam-border rounded-2xl bg-bdam-surface/30">
                <span className="text-bdam-text opacity-50 text-sm">No uploads yet</span>
              </div>
            </div>
          )}
        </section>

        {/* ── Section 2: Assets You Own ── */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-6 text-bdam-text">Assets You Own</h2>
          
          {/* Grid Container */}
          {owned.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {owned.map((asset) => (
                <div key={asset.id} className="bg-bdam-surface rounded-xl p-5 shadow-lg border border-bdam-border flex flex-col gap-3 transition-transform duration-300 hover:scale-105">
                  <h3 className="font-bold text-bdam-text truncate">{asset.name}</h3>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-bdam-muted">CID</span>
                    <span className="font-mono text-bdam-muted">{asset.cid.slice(0, 8)}...</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs pt-3 mt-1 border-t border-bdam-border">
                    <span className="text-bdam-muted uppercase tracking-wider text-[10px]">Price</span>
                    <span className="font-bold text-bdam-text">
                      {asset.price} <span className="text-bdam-primary text-[10px]">ETH</span>
                    </span>
                  </div>
                  {asset.cid ? (
                    <a
                      href={`https://gateway.pinata.cloud/ipfs/${asset.cid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full mt-2 flex items-center justify-center border border-bdam-primary text-bdam-primary hover:bg-bdam-primary hover:text-bdam-text transition-colors py-2 rounded-lg text-xs font-semibold active:scale-[0.98]"
                    >
                      View on IPFS
                    </a>
                  ) : (
                    <button disabled className="w-full mt-2 border border-bdam-border py-2 rounded-lg text-xs font-semibold text-bdam-muted opacity-50 cursor-not-allowed">
                      CID Unavailable
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="col-span-full py-16 flex flex-col items-center justify-center border border-dashed border-bdam-border rounded-2xl bg-bdam-surface/30">
                <span className="text-bdam-text opacity-50 text-sm">No assets owned</span>
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
