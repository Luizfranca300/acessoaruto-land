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
  X,
  Share2,
} from "lucide-react";
import {
  getVehicle,
  createContactInquiry,
  Vehicle,
  ContactInquiry,
} from "../lib/api";
import SEO from "../components/SEO";

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
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

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

  function openLightbox(index: number) {
    setLightboxIndex(index);
    setShowLightbox(true);
  }

  function closeLightbox() {
    setShowLightbox(false);
  }

  function nextLightboxImage() {
    if (vehicle) {
      setLightboxIndex((prev) => (prev + 1) % vehicle.images.length);
    }
  }

  function prevLightboxImage() {
    if (vehicle) {
      setLightboxIndex(
        (prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length
      );
    }
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

  function handleShare() {
    const url = window.location.href;
    const text = `Confira este ${vehicle?.brand?.name} ${vehicle?.model} ${vehicle?.year} na Acessorauto Veículos!`;

    if (navigator.share) {
      navigator.share({
        title: `${vehicle?.brand?.name} ${vehicle?.model}`,
        text: text,
        url: url,
      }).catch(() => {
        // Se o usuário cancelar, não faz nada
      });
    } else {
      setShowShareMenu(true);
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copiado!');
    setShowShareMenu(false);
  }

  function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    setShowShareMenu(false);
  }

  function shareOnWhatsApp() {
    const text = encodeURIComponent(`Confira este ${vehicle?.brand?.name} ${vehicle?.model} ${vehicle?.year}!`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
    setShowShareMenu(false);
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

  const vehicleTitle = vehicle ? `${vehicle.brand?.name} ${vehicle.model} ${vehicle.year}` : 'Veículo';
  const vehicleDescription = vehicle ? 
    `${vehicle.brand?.name} ${vehicle.model} ${vehicle.year} - ${fuelTypeLabels[vehicle.fuel_type]} - ${vehicle.mileage.toLocaleString('pt-BR')} km - R$ ${Number(vehicle.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 
    'Confira os detalhes deste veículo';
  // Garantir que sempre tenha uma imagem válida para compartilhamento
  const vehicleImage = vehicle?.images?.[0] || '/og-default.jpg';
  const vehicleUrl = window.location.href;

  return (
    <>
      <SEO 
        title={vehicleTitle}
        description={vehicleDescription}
        image={vehicleImage}
        url={vehicleUrl}
        type="article"
      />
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link
                to="/inventory"
                className="flex items-center gap-2 text-gray-600 hover:text-red-700 transition-colors"
              >
                <ArrowLeft size={20} />
                Voltar ao Estoque
              </Link>
              
              <div className="relative">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-800 transition-colors"
                >
                  <Share2 size={18} />
                  Compartilhar
                </button>

                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={shareOnWhatsApp}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                      <MessageCircle size={18} className="text-green-600" />
                      WhatsApp
                    </button>
                    <button
                      onClick={shareOnFacebook}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-[18px] h-[18px] text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </button>
                    <button
                      onClick={copyLink}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                      <Share2 size={18} className="text-gray-600" />
                      Copiar Link
                    </button>
                    <button
                      onClick={() => setShowShareMenu(false)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors text-gray-500 text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>
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
                    {/* Imagem clicável */}
                    <div 
                      className="relative w-full h-full cursor-pointer"
                      onClick={() => openLightbox(currentImageIndex)}
                    >
                      <img
                        src={vehicle.images[currentImageIndex]}
                        alt={`${vehicle.brand?.name} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Indicador de clique */}
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white px-4 py-2 rounded-lg text-sm">
                          Clique para ampliar
                        </div>
                      </div>
                    </div>

                    {vehicle.images.length > 1 && (
                      <>
                        {/* Navigation buttons - agora visíveis em mobile também */}
                        <button
                          onClick={prevImage}
                          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
                        >
                          <ChevronLeft size={20} className="md:w-6 md:h-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
                        >
                          <ChevronRight size={20} className="md:w-6 md:h-6" />
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
                {vehicle.brand?.name} {vehicle.model}
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
                    `Olá! Tenho interesse no veículo ${vehicle.brand?.name || ''} ${vehicle.model} ${vehicle.year}`
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

      {/* Lightbox Modal */}
      {showLightbox && vehicle && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Botão Fechar */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors z-50"
          >
            <X size={24} />
          </button>

          {/* Navegação */}
          {vehicle.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevLightboxImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 p-3 rounded-full hover:bg-black/70 transition-colors z-50"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextLightboxImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 p-3 rounded-full hover:bg-black/70 transition-colors z-50"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          {/* Imagem */}
          <div 
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={vehicle.images[lightboxIndex]}
              alt={`${vehicle.brand?.name} ${vehicle.model}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Contador de imagens */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full text-sm">
            {lightboxIndex + 1} / {vehicle.images.length}
          </div>

          {/* Miniaturas */}
          {vehicle.images.length > 1 && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] px-4 py-2">
              {vehicle.images.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(index);
                  }}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === lightboxIndex
                      ? "border-white scale-110"
                      : "border-white/30 hover:border-white/60"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Miniatura ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Overlay para fechar menu de compartilhamento */}
      {showShareMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowShareMenu(false)}
        />
      )}
      </div>
    </>
  );
}
