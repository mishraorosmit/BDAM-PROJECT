import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const getLinkClass = (path) => {
    return location.pathname === path
      ? "text-amber-400 font-bold"
      : "hover:text-amber-400 font-bold text-gray-300";
  };

  return (
    <nav className="p-4 bg-gray-900 flex gap-4">
      <Link className={getLinkClass("/")} to="/">Home</Link>
      <Link className={getLinkClass("/marketplace")} to="/marketplace">Marketplace</Link>
      <Link className={getLinkClass("/profile")} to="/profile">Profile</Link>
      <Link className={getLinkClass("/upload")} to="/upload">Upload</Link>
    </nav>
  );
}
