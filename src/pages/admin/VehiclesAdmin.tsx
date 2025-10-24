import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Edit3, Trash2, Eye, X } from "lucide-react";
import { getVehicles, deleteVehicle, Vehicle } from "../../lib/api";
import AcessorautoLogo from "../../components/AcessorautoLogo";
import { useToast } from "../../lib/toast";

export default function VehiclesAdmin() {
  const { showToast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  async function handleDelete() {
    if (!vehicleToDelete) return;

    setDeleting(true);
    try {
      await deleteVehicle(vehicleToDelete.id);
      setVehicles(vehicles.filter((v) => v.id !== vehicleToDelete.id));
      setVehicleToDelete(null);
      showToast("success", "Veículo deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar veículo:", error);
      showToast("error", "Erro ao deletar veículo. Tente novamente.");
    } finally {
      setDeleting(false);
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
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
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
                                alt={`${vehicle.brand?.name} ${vehicle.model}`}
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
                                {vehicle.brand?.name} {vehicle.model}
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
                              onClick={() => setVehicleToDelete(vehicle)}
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

            {/* Mobile Card View */}
            <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
                >
                  {/* Vehicle Image */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                    {vehicle.images.length > 0 ? (
                      <img
                        src={vehicle.images[0]}
                        alt={`${vehicle.brand?.name} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400 text-sm">Sem foto</span>
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
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
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {vehicle.brand?.name} {vehicle.model}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {vehicle.year} • {vehicle.color}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      {Number(vehicle.mileage).toLocaleString("pt-BR")} km
                    </p>
                    <p className="text-xl font-bold text-red-700 mb-4">
                      R${" "}
                      {Number(vehicle.price).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </p>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      <Link
                        to={`/vehicle/${vehicle.id}`}
                        className="flex items-center justify-center gap-1 bg-blue-50 text-blue-700 px-2 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Ver</span>
                      </Link>
                      <Link
                        to={`/admin/vehicles/${vehicle.id}/edit`}
                        className="flex items-center justify-center gap-1 bg-green-50 text-green-700 px-2 py-2 rounded-lg hover:bg-green-100 transition-colors text-sm"
                        title="Editar"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span className="hidden sm:inline">Editar</span>
                      </Link>
                      <button
                        onClick={() => setVehicleToDelete(vehicle)}
                        className="flex items-center justify-center gap-1 bg-red-50 text-red-700 px-2 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm"
                        title="Deletar"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Excluir</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Modal de Confirmação de Exclusão */}
      {vehicleToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            {/* Header do Modal */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Trash2 className="w-6 h-6" />
                  Confirmar Exclusão
                </h3>
                <button
                  onClick={() => setVehicleToDelete(null)}
                  className="text-white hover:text-red-100 transition-colors"
                  disabled={deleting}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Tem certeza que deseja deletar este veículo?
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  {vehicleToDelete.images.length > 0 && (
                    <img
                      src={vehicleToDelete.images[0]}
                      alt={`${vehicleToDelete.brand?.name} ${vehicleToDelete.model}`}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">
                      {vehicleToDelete.brand?.name} {vehicleToDelete.model}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Ano {vehicleToDelete.year} • {vehicleToDelete.color}
                    </p>
                    <p className="text-red-600 font-semibold text-sm">
                      R${" "}
                      {Number(vehicleToDelete.price).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <strong>⚠️ Atenção:</strong> Esta ação não pode ser desfeita.
                Todas as imagens do veículo também serão removidas do servidor.
              </p>

              {/* Botões de Ação */}
              <div className="flex gap-3">
                <button
                  onClick={() => setVehicleToDelete(null)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  disabled={deleting}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Deletando...
                    </span>
                  ) : (
                    "Sim, Deletar"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
