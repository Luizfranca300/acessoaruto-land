import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Car, Filter, X } from "lucide-react";
import { getVehicles, getBrands, Vehicle, Brand } from "../lib/api";

export default function Inventory() {
  const [searchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(() => {
    // Inicializar com o valor da URL se existir
    return searchParams.get("brand") || "";
  });
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [selectedFuelType, setSelectedFuelType] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadBrands();
  }, []);

  async function loadBrands() {
    try {
      const brandsData = await getBrands();
      setBrands(brandsData);
    } catch (error) {
      console.error("Erro ao carregar marcas:", error);
    }
  }

  useEffect(() => {
    async function fetchVehicles() {
      setLoading(true);
      try {
        const filters: Record<string, string | number | boolean> = {
          is_sold: false,
        };

        if (selectedBrand) {
          filters.brand_id = selectedBrand;
        }

        if (selectedYear) {
          filters.year = parseInt(selectedYear);
        }

        if (selectedTransmission) {
          filters.transmission = selectedTransmission;
        }

        if (selectedFuelType) {
          filters.fuel_type = selectedFuelType;
        }

        if (priceRange.min) {
          filters.min_price = parseFloat(priceRange.min);
        }

        if (priceRange.max) {
          filters.max_price = parseFloat(priceRange.max);
        }

        console.log("Filtros enviados ao backend:", filters);
        const vehiclesData = await getVehicles(filters);
        console.log("Veículos recebidos:", vehiclesData.length);

        // Aplicar filtro de busca por texto no frontend (não disponível no backend)
        let filtered = vehiclesData;
        if (searchTerm) {
          filtered = vehiclesData.filter(
            (v: Vehicle) =>
              v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
              v.brand?.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        setVehicles(filtered);
      } catch (error) {
        console.error("Erro ao carregar veículos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVehicles();
  }, [
    selectedBrand,
    selectedYear,
    selectedTransmission,
    selectedFuelType,
    priceRange,
    searchTerm,
  ]);

  function clearFilters() {
    setSearchTerm("");
    setSelectedBrand("");
    setSelectedYear("");
    setSelectedTransmission("");
    setSelectedFuelType("");
    setPriceRange({ min: "", max: "" });
  }

  const years = Array.from(
    { length: 25 },
    (_, i) => new Date().getFullYear() - i
  );

  const hasActiveFilters =
    selectedBrand ||
    selectedYear ||
    selectedTransmission ||
    selectedFuelType ||
    priceRange.min ||
    priceRange.max;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-red-700 to-red-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Nosso Estoque</h1>
          <p className="text-xl text-red-50">
            Encontre o veículo perfeito para você
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Filter size={20} />
                  Filtros
                </h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-red-700 text-sm font-semibold hover:text-red-800 flex items-center gap-1"
                  >
                    <X size={16} />
                    Limpar
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Buscar
                  </label>
                  <div className="relative">
                    <Search
                      size={18}
                      className="absolute left-3 top-3 text-gray-400"
                    />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Marca ou modelo..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Marca
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Todas as marcas</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ano
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Todos os anos</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Câmbio
                  </label>
                  <select
                    value={selectedTransmission}
                    onChange={(e) => setSelectedTransmission(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    <option value="manual">Manual</option>
                    <option value="automatic">Automático</option>
                    <option value="cvt">CVT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Combustível
                  </label>
                  <select
                    value={selectedFuelType}
                    onChange={(e) => setSelectedFuelType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    <option value="gasoline">Gasolina</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Elétrico</option>
                    <option value="hybrid">Híbrido</option>
                    <option value="flex">Flex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Faixa de Preço
                  </label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, min: e.target.value })
                      }
                      placeholder="Mínimo"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, max: e.target.value })
                      }
                      placeholder="Máximo"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">
                  {vehicles.length}
                </span>{" "}
                veículos encontrados
              </p>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden bg-red-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-800 transition-colors flex items-center gap-2"
              >
                <Filter size={18} />
                Filtros
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Carregando veículos...</p>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <Car size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 text-lg mb-2">
                  Nenhum veículo encontrado
                </p>
                <p className="text-gray-500">
                  Tente ajustar os filtros de busca
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                  <Link
                    key={vehicle.id}
                    to={`/vehicle/${vehicle.id}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all hover:scale-105 cursor-pointer block"
                  >
                    <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                      {vehicle.images.length > 0 ? (
                        <img
                          src={vehicle.images[0]}
                          alt={`${vehicle.brand?.name} ${vehicle.model}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Car size={64} className="text-gray-400" />
                        </div>
                      )}
                      {vehicle.is_featured && (
                        <div className="absolute top-4 left-4 bg-red-700 text-white px-3 py-1 rounded-full text-sm font-bold">
                          Destaque
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {vehicle.brand?.name} {vehicle.model}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <span>{vehicle.year}</span>
                        <span>•</span>
                        <span>
                          {vehicle.mileage.toLocaleString("pt-BR")} km
                        </span>
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
          </main>
        </div>
      </div>
    </div>
  );
}
