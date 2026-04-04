import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function Navbar() {
  const location = useLocation();
  const [wallet, setWallet] = useState(null);

  const getLinkClass = (path) => {
    return location.pathname === path
      ? "text-amber-400 font-bold px-4 py-2 min-h-[40px] flex items-center shrink-0"
      : "hover:text-amber-400 font-bold text-gray-300 px-4 py-2 min-h-[40px] flex items-center shrink-0 transition-colors";
  };

  const shortAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        console.warn("MetaMask not installed");
        alert("MetaMask not installed");
        return;
      }
      
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      
      if (accounts && accounts.length > 0) {
        setWallet(accounts[0]);
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  // Optional: Auto-detect existing connection on mount
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" })
        .then(accounts => {
          if (accounts.length > 0) setWallet(accounts[0]);
        })
        .catch(console.error);
      
      // Auto-update on account change
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) setWallet(accounts[0]);
        else setWallet(null);
      });
    }
  }, []);

  return (
    <nav className="p-4 bg-gray-900 flex flex-wrap gap-2 md:gap-4 items-center justify-between shadow-md relative z-50">
      <div className="flex flex-wrap gap-2 items-center">
        <Link className={getLinkClass("/")} to="/">Home</Link>
        <Link className={getLinkClass("/marketplace")} to="/marketplace">Marketplace</Link>
        <Link className={getLinkClass("/profile")} to="/profile">Profile</Link>
        <Link className={getLinkClass("/upload")} to="/upload">Upload</Link>
      </div>
      
      <div className="flex items-center ml-auto">
        <button 
          onClick={connectWallet}
          className="h-10 px-4 py-2 rounded-lg font-bold bg-bdam-surface text-bdam-text border border-bdam-border hover:bg-bdam-primary transition-colors shrink-0 whitespace-nowrap"
        >
          {wallet ? shortAddress(wallet) : "Connect Wallet"}
        </button>
      </div>
    </nav>
  );
}
