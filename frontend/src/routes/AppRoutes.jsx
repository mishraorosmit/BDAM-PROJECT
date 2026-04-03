import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import Marketplace from "../pages/marketplace";
import Profile from "../pages/profile";
import Upload from "../pages/upload";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/upload" element={<Upload />} />
    </Routes>
  );
}
