import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Phone,
  Mail,
  Car,
  Eye,
  Trash2,
} from "lucide-react";
import { getToken, removeToken } from "../../lib/auth";
import { API_URL } from "../../lib/api";
import AcessorautoLogo from "../../components/AcessorautoLogo";

type Valuation = {
  id: string;
  name: string;
  email: string;
  phone: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  additional_info?: string;
  createdAt: string;
};

export default function ValuationsAdmin() {
  const navigate = useNavigate();
  const [valuations, setValuations] = useState<Valuation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedValuation, setSelectedValuation] = useState<Valuation | null>(
    null
  );
  const [valuationToDelete, setValuationToDelete] = useState<Valuation | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/admin/login");
      return;
    }

    async function loadValuations() {
      try {
        const token = getToken();
        const response = await fetch(
          `${API_URL}/vehicle-valuations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            removeToken();
            navigate("/admin/login");
            return;
          }
          throw new Error("Erro ao carregar avaliações");
        }

        const data = await response.json();
        setValuations(data);
      } catch (error) {
        console.error("Erro ao carregar avaliações:", error);
      } finally {
        setLoading(false);
      }
    }

    loadValuations();
  }, [navigate]);

  async function handleDelete() {
    if (!valuationToDelete) return;

    setDeleting(true);
    try {
      const token = getToken();
      const response = await fetch(
        `${API_URL}/vehicle-valuations/${valuationToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Erro ao deletar avaliação");
      }

      setValuations(valuations.filter((v) => v.id !== valuationToDelete.id));
      setValuationToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar avaliação:", error);
      alert("Erro ao deletar avaliação");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg">
                <AcessorautoLogo size={32} />
              </div>
              <h1 className="text-2xl font-bold text-white">
                Gerenciar Avaliações
              </h1>
            </div>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Solicitações de Avaliação ({valuations.length})
            </h2>

            {valuations.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Nenhuma solicitação de avaliação ainda
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {valuations.map((valuation) => (
                  <div
                    key={valuation.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {valuation.name}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {new Date(valuation.createdAt).toLocaleDateString(
                              "pt-BR"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {valuation.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {valuation.phone}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Car className="w-4 h-4 text-primary-600" />
                          <span className="font-medium text-gray-900">
                            {valuation.brand} {valuation.model} {valuation.year}
                          </span>
                          <span className="text-gray-500">
                            • {valuation.mileage.toLocaleString()} km
                          </span>
                          <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs">
                            {valuation.condition}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedValuation(valuation)}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setValuationToDelete(valuation)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Deletar"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de Detalhes */}
      {selectedValuation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Detalhes da Avaliação
                </h3>
                <button
                  onClick={() => setSelectedValuation(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Nome do Cliente
                  </label>
                  <p className="text-gray-900 mt-1">{selectedValuation.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="text-gray-900 mt-1">
                      {selectedValuation.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Telefone
                    </label>
                    <p className="text-gray-900 mt-1">
                      {selectedValuation.phone}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Informações do Veículo
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Marca
                      </label>
                      <p className="text-gray-900 mt-1">
                        {selectedValuation.brand}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Modelo
                      </label>
                      <p className="text-gray-900 mt-1">
                        {selectedValuation.model}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Ano
                      </label>
                      <p className="text-gray-900 mt-1">
                        {selectedValuation.year}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Quilometragem
                      </label>
                      <p className="text-gray-900 mt-1">
                        {selectedValuation.mileage.toLocaleString()} km
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Condição
                      </label>
                      <p className="text-gray-900 mt-1">
                        {selectedValuation.condition}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedValuation.additional_info && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Informações Adicionais
                    </label>
                    <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                      {selectedValuation.additional_info}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Data da Solicitação
                  </label>
                  <p className="text-gray-900 mt-1">
                    {new Date(selectedValuation.createdAt).toLocaleString(
                      "pt-BR"
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <a
                  href={`mailto:${selectedValuation.email}`}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-center"
                >
                  Responder por Email
                </a>
                <button
                  onClick={() => setSelectedValuation(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {valuationToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Confirmar Exclusão
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja deletar a avaliação do veículo{" "}
              <strong>
                {valuationToDelete.brand} {valuationToDelete.model}{" "}
                {valuationToDelete.year}
              </strong>
              ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setValuationToDelete(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deletando...
                  </>
                ) : (
                  "Deletar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
