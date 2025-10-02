import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import VehicleDetail from './pages/VehicleDetail';
import SellCar from './pages/SellCar';
import Financing from './pages/Financing';
import About from './pages/About';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  function handleNavigate(page: string, vehicleId?: string) {
    setCurrentPage(page);
    if (vehicleId) {
      setSelectedVehicleId(vehicleId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-1">
        {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
        {currentPage === 'inventory' && <Inventory onNavigate={handleNavigate} />}
        {currentPage === 'vehicle' && selectedVehicleId && (
          <VehicleDetail vehicleId={selectedVehicleId} onNavigate={handleNavigate} />
        )}
        {currentPage === 'sell' && <SellCar />}
        {currentPage === 'financing' && <Financing />}
        {currentPage === 'about' && <About />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
