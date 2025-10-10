import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Car,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Palette,
  Phone,
  Mail,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getVehicle,
  createContactInquiry,
  Vehicle,
  ContactInquiry,
} from "../lib/api";

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    async function loadVehicle() {
      if (!id) return;

      try {
        const data = await getVehicle(id);
        setVehicle(data);
      } catch (error) {
        console.error("Error loading vehicle:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadVehicle();
    }
  }, [id]);

  async function handleSubmitInquiry(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const inquiry: ContactInquiry = {
        ...formData,
        vehicle_id: id!,
        inquiry_type: "vehicle_info",
      };

      await createContactInquiry(inquiry);

      setSubmitSuccess(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => {
        setShowContactForm(false);
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      alert("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  function nextImage() {
    if (vehicle) {
      setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length);
    }
  }

  function prevImage() {
    if (vehicle) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length
      );
    }
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  }

  function handleTouchStart(e: React.TouchEvent) {
    setTouchStart(e.targetTouches[0].clientX);
  }

  function handleTouchMove(e: React.TouchEvent) {
    setTouchEnd(e.targetTouches[0].clientX);
  }

  function handleTouchEnd() {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }

    setTouchStart(0);
    setTouchEnd(0);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Veículo não encontrado</p>
          <Link
            to="/inventory"
            className="bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors inline-block"
          >
            Voltar ao Estoque
          </Link>
        </div>
      </div>
    );
  }

  const fuelTypeLabels: Record<string, string> = {
    gasoline: "Gasolina",
    diesel: "Diesel",
    electric: "Elétrico",
    hybrid: "Híbrido",
    flex: "Flex",
  };

  const transmissionLabels: Record<string, string> = {
    manual: "Manual",
    automatic: "Automático",
    cvt: "CVT",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/inventory"
            className="flex items-center gap-2 text-gray-600 hover:text-red-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Voltar ao Estoque
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div 
                className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden group"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {vehicle.images.length > 0 ? (
                  <>
                    {/* Desktop: Zoom on hover */}
                    <div 
                      className="hidden md:block relative w-full h-full cursor-zoom-in"
                      onMouseMove={handleMouseMove}
                    >
                      <img
                        src={vehicle.images[currentImageIndex]}
                        alt={`${vehicle.brands?.name} ${vehicle.model}`}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-150"
                        style={{
                          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        }}
                      />
                    </div>

                    {/* Mobile: Normal view with swipe */}
                    <div className="md:hidden relative w-full h-full">
                      <img
                        src={vehicle.images[currentImageIndex]}
                        alt={`${vehicle.brands?.name} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {vehicle.images.length > 1 && (
                      <>
                        {/* Navigation buttons - hidden on mobile, shown on desktop */}
                        <button
                          onClick={prevImage}
                          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={nextImage}
                          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
                        >
                          <ChevronRight size={24} />
                        </button>
                        
                        {/* Image indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                          {vehicle.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === currentImageIndex
                                  ? "bg-white w-8"
                                  : "bg-white/50"
                              }`}
                            />
                          ))}
                        </div>

                        {/* Mobile swipe instruction - shown briefly */}
                        <div className="md:hidden absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full opacity-0 group-active:opacity-100 transition-opacity">
                          Deslize para navegar
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car size={64} className="text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {vehicle.brands?.name} {vehicle.model}
              </h1>
              <p className="text-4xl font-bold text-red-700 mb-6">
                R${" "}
                {Number(vehicle.price).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar size={24} className="text-red-700" />
                  <div>
                    <p className="text-sm text-gray-600">Ano</p>
                    <p className="font-semibold text-gray-800">
                      {vehicle.year}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Gauge size={24} className="text-red-700" />
                  <div>
                    <p className="text-sm text-gray-600">Quilometragem</p>
                    <p className="font-semibold text-gray-800">
                      {vehicle.mileage.toLocaleString("pt-BR")} km
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Fuel size={24} className="text-red-700" />
                  <div>
                    <p className="text-sm text-gray-600">Combustível</p>
                    <p className="font-semibold text-gray-800">
                      {fuelTypeLabels[vehicle.fuel_type]}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Settings size={24} className="text-red-700" />
                  <div>
                    <p className="text-sm text-gray-600">Câmbio</p>
                    <p className="font-semibold text-gray-800">
                      {transmissionLabels[vehicle.transmission]}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Palette size={24} className="text-red-700" />
                  <div>
                    <p className="text-sm text-gray-600">Cor</p>
                    <p className="font-semibold text-gray-800">
                      {vehicle.color}
                    </p>
                  </div>
                </div>
              </div>

              {vehicle.description && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">
                    Descrição
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {vehicle.description}
                  </p>
                </div>
              )}

              {vehicle.features && vehicle.features.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-3">
                    Características
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {vehicle.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <div className="w-2 h-2 bg-red-700 rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Interessado?
              </h2>
              <p className="text-gray-600 mb-6">
                Entre em contato conosco para mais informações
              </p>

              <div className="space-y-3 mb-6">
                <a
                  href="tel:+553432229303"
                  className="flex items-center justify-center gap-2 w-full bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors"
                >
                  <Phone size={20} />
                  (34) 3222-9303
                </a>
                <a
                  href={`https://wa.me/5534999989303?text=${encodeURIComponent(
                    `Olá! Tenho interesse no veículo ${vehicle.brands?.name} ${vehicle.model} ${vehicle.year}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  <MessageCircle size={20} />
                  WhatsApp
                </a>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
              </div>

              <button
                onClick={() => setShowContactForm(!showContactForm)}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                <Mail size={20} />
                Enviar Mensagem
              </button>

              {showContactForm && (
                <form onSubmit={handleSubmitInquiry} className="mt-6 space-y-4">
                  {submitSuccess ? (
                    <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg text-center">
                      Mensagem enviada com sucesso! Entraremos em contato em
                      breve.
                    </div>
                  ) : (
                    <>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Nome"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="E-mail"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="Telefone"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder="Mensagem"
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      />
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors disabled:bg-gray-400"
                      >
                        {submitting ? "Enviando..." : "Enviar"}
                      </button>
                    </>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
