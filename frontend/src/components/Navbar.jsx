import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="p-4 bg-gray-900 text-white flex gap-4">
      <Link className="hover:text-amber-400 font-bold" to="/">Home</Link>
      <Link className="hover:text-amber-400 font-bold" to="/marketplace">Marketplace</Link>
      <Link className="hover:text-amber-400 font-bold" to="/profile">Profile</Link>
      <Link className="hover:text-amber-400 font-bold" to="/upload">Upload</Link>
    </nav>
  );
}
