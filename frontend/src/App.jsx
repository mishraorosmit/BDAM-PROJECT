import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white">
      
      {/* NAVBAR */}
      <Navbar />

      {/* ROUTES */}
      <AppRoutes />

    </div>
  );
}

export default App;