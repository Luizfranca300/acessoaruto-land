import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import VehicleDetail from "./pages/VehicleDetail";
import SellCar from "./pages/SellCar";
import Financing from "./pages/Financing";
import About from "./pages/About";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import VehiclesAdmin from "./pages/admin/VehiclesAdmin";
import NewVehicle from "./pages/admin/NewVehicle";
import EditVehicle from "./pages/admin/EditVehicle";
import Settings from "./pages/admin/Settings";
import { ToastProvider } from "./lib/toast";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Admin Routes - Sem Header/Footer */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/vehicles" element={<VehiclesAdmin />} />
          <Route path="/admin/vehicles/new" element={<NewVehicle />} />
          <Route path="/admin/vehicles/:id/edit" element={<EditVehicle />} />

          {/* Public Routes - Com Header/Footer */}
          <Route
            path="/*"
            element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/vehicle/:id" element={<VehicleDetail />} />
                    <Route path="/sell" element={<SellCar />} />
                    <Route path="/financing" element={<Financing />} />
                    <Route path="/about" element={<About />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
