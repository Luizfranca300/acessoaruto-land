import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Car, DollarSign, Award, ChevronRight, Phone } from "lucide-react";
import { getVehicles, getBrands, Vehicle, Brand } from "../lib/api";

export default function Home() {
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [vehicles, brandsData] = await Promise.all([
        getVehicles({ is_featured: true, is_sold: false }),
        getBrands(),
      ]);

      setFeaturedVehicles(vehicles.slice(0, 6));
      setBrands(brandsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <section className="relative bg-gradient-to-br from-red-700 via-red-600 to-red-800 text-white py-20 md:py-32 overflow-hidden">
        {/* Imagem de fundo com parallax */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80')",
              backgroundBlendMode: "multiply",
            }}
          ></div>
        </div>

        {/* Gradiente animado overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-700/80 via-red-600/60 to-red-800/80 animate-gradient"></div>

        {/* Animação de fundo com formas geométricas */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Círculos animados */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute top-40 right-20 w-96 h-96 bg-red-400/20 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute bottom-20 left-1/3 w-80 h-80 bg-red-600/20 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>

            {/* Formas geométricas flutuantes */}
            <div className="absolute top-20 right-1/4 w-32 h-32 border-2 border-white/10 rounded-lg rotate-45 animate-float"></div>
            <div className="absolute bottom-32 right-20 w-24 h-24 border-2 border-white/10 rounded-full animate-float-delayed"></div>
            <div
              className="absolute top-1/2 left-20 w-40 h-40 border-2 border-white/10 rotate-12 animate-float"
              style={{ animationDelay: "1.5s" }}
            ></div>

            {/* Linhas diagonais decorativas */}
            <div className="absolute top-0 right-0 w-1 h-64 bg-gradient-to-b from-transparent via-white/20 to-transparent transform rotate-45 animate-float"></div>
            <div className="absolute bottom-0 left-1/4 w-1 h-96 bg-gradient-to-b from-transparent via-white/10 to-transparent transform -rotate-12 animate-float-delayed"></div>

            {/* Ícone de carro decorativo */}
            <div className="absolute top-1/3 right-10 opacity-10 animate-float-delayed">
              <Car size={120} strokeWidth={1} />
            </div>
          </div>
        </div>

        {/* Overlay escuro */}
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              Encontre o Carro dos Seus Sonhos
            </h1>
            <p
              className="text-xl md:text-2xl mb-8 text-red-50 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              Os melhores veículos seminovos com qualidade garantida e condições
              especiais de financiamento
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              <Link
                to="/inventory"
                className="group bg-white text-brand-800 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 animate-slide-up shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center gap-2">
                  <Car size={20} />
                  Ver Estoque Completo
                </span>
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/sell"
                className="group border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-brand-800 transition-all duration-300 flex items-center gap-2 animate-slide-up shadow-lg"
              >
                <span className="flex items-center gap-2">
                  <DollarSign size={20} />
                  Venda seu Carro
                </span>
                <DollarSign className="group-hover:rotate-12 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car size={32} className="text-red-700" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                Amplo Estoque
              </h3>
              <p className="text-gray-600">
                Centenas de veículos de diversas marcas e modelos à sua escolha
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award size={32} className="text-red-700" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                Qualidade Garantida
              </h3>
              <p className="text-gray-600">
                Todos os veículos são vistoriados e revisados antes da venda
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign size={32} className="text-red-700" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                Financiamento Facilitado
              </h3>
              <p className="text-gray-600">
                Parcelamento em até 60x com as melhores taxas do mercado
              </p>
            </div>
          </div>
        </div>
      </section>

      {brands.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Marcas Disponíveis
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  to="/inventory"
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center"
                >
                  <span className="text-gray-700 font-semibold text-center">
                    {brand.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">
              Veículos em Destaque
            </h2>
            <Link
              to="/inventory"
              className="text-red-700 font-semibold hover:text-red-800 flex items-center gap-2"
            >
              Ver Todos
              <ChevronRight size={20} />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Carregando veículos...</p>
            </div>
          ) : featuredVehicles.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-lg">
                Nenhum veículo disponível no momento
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVehicles.map((vehicle) => (
                <Link
                  key={vehicle.id}
                  to={`/vehicle/${vehicle.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all hover:scale-105 cursor-pointer block"
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                    {vehicle.images.length > 0 ? (
                      <img
                        src={vehicle.images[0]}
                        alt={`${vehicle.brands?.name} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Car size={64} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {vehicle.brands?.name} {vehicle.model}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <span>{vehicle.year}</span>
                      <span>•</span>
                      <span>{vehicle.mileage.toLocaleString("pt-BR")} km</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-red-700">
                        R${" "}
                        {Number(vehicle.price).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                      <button className="bg-red-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-800 transition-colors">
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-red-700 to-red-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Quer Vender seu Carro?</h2>
          <p className="text-xl mb-8 text-red-50 max-w-2xl mx-auto">
            Avaliamos seu veículo gratuitamente e oferecemos a melhor proposta
            do mercado
          </p>
          <Link
            to="/sell"
            className="bg-white text-red-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-50 transition-all hover:scale-105 shadow-lg inline-flex items-center gap-2"
          >
            Avaliar Meu Veículo
            <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Entre em Contato
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Nossa equipe está pronta para ajudar você a encontrar o veículo
              perfeito
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+553432229303"
                className="bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-800 transition-all hover:scale-105 shadow-lg inline-flex items-center justify-center gap-2"
              >
                <Phone size={20} />
                (34) 3222-9303
              </a>
              <a
                href="https://wa.me/5534999989303"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-all hover:scale-105 shadow-lg inline-flex items-center justify-center gap-2"
              >
                <Phone size={20} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
