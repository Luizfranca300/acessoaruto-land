import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Edit3, Trash2, Eye } from "lucide-react";
import { getVehicles, Vehicle } from "../../lib/api";
import AcessorautoLogo from "../../components/AcessorautoLogo";

export default function VehiclesAdmin() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicles() {
    try {
      const data = await getVehicles({});
      setVehicles(data);
    } catch (error) {
      console.error("Erro ao carregar veículos:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-700 via-red-600 to-red-800 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 shadow-lg relative overflow-hidden">
        {/* Imagem de fundo no header */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80')",
              backgroundBlendMode: "multiply",
            }}
          ></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-2 text-white hover:text-red-100 transition-colors bg-white/10 px-3 py-2 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </Link>
              <div className="bg-white p-2 rounded-lg">
                <AcessorautoLogo size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Gerenciar Veículos
                </h1>
                <p className="text-red-100 text-sm">
                  Total: {vehicles.length} veículos
                </p>
              </div>
            </div>
            <Link
              to="/admin/vehicles/new"
              className="bg-white text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-md"
            >
              <Plus className="w-5 h-5" />
              Adicionar Veículo
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {vehicles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">
              Nenhum veículo cadastrado
            </p>
            <Link
              to="/admin/vehicles/new"
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 inline-flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Adicionar Primeiro Veículo
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-red-600 to-red-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Veículo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Ano
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Preço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vehicles.map((vehicle) => (
                    <tr
                      key={vehicle.id}
                      className="hover:bg-red-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {vehicle.images.length > 0 ? (
                            <img
                              src={vehicle.images[0]}
                              alt={`${vehicle.brands?.name} ${vehicle.model}`}
                              className="w-12 h-12 rounded-lg object-cover mr-4"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4 flex items-center justify-center">
                              <span className="text-gray-500 text-xs">
                                Sem foto
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="text-gray-900 font-medium">
                              {vehicle.brands?.name} {vehicle.model}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {vehicle.color} •{" "}
                              {Number(vehicle.mileage).toLocaleString("pt-BR")}{" "}
                              km
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {vehicle.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        R${" "}
                        {Number(vehicle.price).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            vehicle.is_sold
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : vehicle.is_featured
                              ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                              : "bg-green-100 text-green-700 border border-green-200"
                          }`}
                        >
                          {vehicle.is_sold
                            ? "Vendido"
                            : vehicle.is_featured
                            ? "Destaque"
                            : "Disponível"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/vehicle/${vehicle.id}`}
                            className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Visualizar"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/vehicles/${vehicle.id}/edit`}
                            className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() =>
                              alert("Função de deletar será implementada")
                            }
                            className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Deletar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
