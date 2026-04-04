import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white">
      <Navbar />
      <AppRoutes />
    </div>
  );
}

export default App;