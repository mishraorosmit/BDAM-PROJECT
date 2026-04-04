import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="bg-bdam-bg min-h-screen text-white overflow-x-hidden flex flex-col break-words">
      <Navbar />
      <AppRoutes />
    </div>
  );
}

export default App;