import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, X, Wand2 } from "lucide-react";
import { getBrands, Brand } from "../../lib/api";
import AcessorautoLogo from "../../components/AcessorautoLogo";
import { useToast } from "../../lib/toast";
import { getToken } from "../../lib/auth";

export default function BrandsAdmin() {
  const { showToast } = useToast();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    logo_url: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchingLogo, setSearchingLogo] = useState(false);
  const [logoSuggestions, setLogoSuggestions] = useState<string[]>([]);

  useEffect(() => {
    async function loadBrands() {
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (error) {
        console.error("Erro ao carregar marcas:", error);
        showToast("error", "Erro ao carregar marcas");
      } finally {
        setLoading(false);
      }
    }

    loadBrands();
  }, [showToast]);

  async function reloadBrands() {
    try {
      const data = await getBrands();
      setBrands(data);
    } catch (error) {
      console.error("Erro ao carregar marcas:", error);
      showToast("error", "Erro ao carregar marcas");
    }
  }

  function openCreateModal() {
    setEditingBrand(null);
    setFormData({ name: "", logo_url: "" });
    setShowModal(true);
  }

  function openEditModal(brand: Brand) {
    setEditingBrand(brand);
    setFormData({ name: brand.name, logo_url: brand.logo_url || "" });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingBrand(null);
    setFormData({ name: "", logo_url: "" });
    setLogoSuggestions([]);
  }

  async function searchBrandLogo() {
    if (!formData.name.trim()) {
      showToast("warning", "Digite o nome da marca primeiro");
      return;
    }

    setSearchingLogo(true);
    setLogoSuggestions([]);

    try {
      // Lista de URLs de logos de marcas populares (CDN confiável)
      const brandLogos: Record<string, string> = {
        toyota: "https://www.carlogos.org/car-logos/toyota-logo.png",
        honda: "https://www.carlogos.org/car-logos/honda-logo.png",
        volkswagen: "https://www.carlogos.org/car-logos/volkswagen-logo.png",
        vw: "https://www.carlogos.org/car-logos/volkswagen-logo.png",
        ford: "https://www.carlogos.org/car-logos/ford-logo.png",
        chevrolet: "https://www.carlogos.org/car-logos/chevrolet-logo.png",
        fiat: "https://www.carlogos.org/car-logos/fiat-logo.png",
        nissan: "https://www.carlogos.org/car-logos/nissan-logo.png",
        hyundai: "https://www.carlogos.org/car-logos/hyundai-logo.png",
        jeep: "https://www.carlogos.org/car-logos/jeep-logo.png",
        renault: "https://www.carlogos.org/car-logos/renault-logo.png",
        peugeot: "https://www.carlogos.org/car-logos/peugeot-logo.png",
        bmw: "https://www.carlogos.org/car-logos/bmw-logo.png",
        mercedes: "https://www.carlogos.org/car-logos/mercedes-benz-logo.png",
        "mercedes-benz":
          "https://www.carlogos.org/car-logos/mercedes-benz-logo.png",
        audi: "https://www.carlogos.org/car-logos/audi-logo.png",
        volvo: "https://www.carlogos.org/car-logos/volvo-logo.png",
        mazda: "https://www.carlogos.org/car-logos/mazda-logo.png",
        mitsubishi: "https://www.carlogos.org/car-logos/mitsubishi-logo.png",
        suzuki: "https://www.carlogos.org/car-logos/suzuki-logo.png",
        kia: "https://www.carlogos.org/car-logos/kia-logo.png",
        citroen: "https://www.carlogos.org/car-logos/citroen-logo.png",
        citroën: "https://www.carlogos.org/car-logos/citroen-logo.png",
        porsche: "https://www.carlogos.org/car-logos/porsche-logo.png",
        ferrari: "https://www.carlogos.org/car-logos/ferrari-logo.png",
        lamborghini: "https://www.carlogos.org/car-logos/lamborghini-logo.png",
        tesla: "https://www.carlogos.org/car-logos/tesla-logo.png",
        subaru: "https://www.carlogos.org/car-logos/subaru-logo.png",
        lexus: "https://www.carlogos.org/car-logos/lexus-logo.png",
        jaguar: "https://www.carlogos.org/car-logos/jaguar-logo.png",
        "land rover": "https://www.carlogos.org/car-logos/land-rover-logo.png",
        mini: "https://www.carlogos.org/car-logos/mini-logo.png",
        dodge: "https://www.carlogos.org/car-logos/dodge-logo.png",
        ram: "https://www.carlogos.org/car-logos/ram-logo.png",
        chrysler: "https://www.carlogos.org/car-logos/chrysler-logo.png",
        gmc: "https://www.carlogos.org/car-logos/gmc-logo.png",
        cadillac: "https://www.carlogos.org/car-logos/cadillac-logo.png",
        buick: "https://www.carlogos.org/car-logos/buick-logo.png",
        alfa: "https://www.carlogos.org/car-logos/alfa-romeo-logo.png",
        "alfa romeo": "https://www.carlogos.org/car-logos/alfa-romeo-logo.png",
        maserati: "https://www.carlogos.org/car-logos/maserati-logo.png",
        bentley: "https://www.carlogos.org/car-logos/bentley-logo.png",
        "rolls-royce":
          "https://www.carlogos.org/car-logos/rolls-royce-logo.png",
        "aston martin":
          "https://www.carlogos.org/car-logos/aston-martin-logo.png",
        mcLaren: "https://www.carlogos.org/car-logos/mclaren-logo.png",
        infiniti: "https://www.carlogos.org/car-logos/infiniti-logo.png",
        acura: "https://www.carlogos.org/car-logos/acura-logo.png",
        genesis: "https://www.carlogos.org/car-logos/genesis-logo.png",
        lincoln: "https://www.carlogos.org/car-logos/lincoln-logo.png",
      };

      const brandName = formData.name.toLowerCase().trim();

      // Buscar correspondência exata ou parcial
      const suggestions: string[] = [];

      if (brandLogos[brandName]) {
        suggestions.push(brandLogos[brandName]);
      }

      // Buscar correspondências parciais
      Object.keys(brandLogos).forEach((key) => {
        if (key.includes(brandName) || brandName.includes(key)) {
          if (!suggestions.includes(brandLogos[key])) {
            suggestions.push(brandLogos[key]);
          }
        }
      });

      // Adicionar opções alternativas usando APIs públicas
      if (suggestions.length === 0) {
        // Logo.dev API - logos de marcas conhecidas
        suggestions.push(`https://logo.clearbit.com/${brandName}.com`);

        // Brandfetch API (algumas marcas gratuitas)
        suggestions.push(
          `https://img.logo.dev/${brandName}.com?token=pk_X-hoQuGkQTSIv3kJBYz3kQ`
        );
      }

      if (suggestions.length > 0) {
        setLogoSuggestions(suggestions);
        // Auto-selecionar o primeiro logo se encontrado
        setFormData({ ...formData, logo_url: suggestions[0] });
        showToast("success", `${suggestions.length} logo(s) encontrado(s)!`);
      } else {
        showToast(
          "warning",
          "Nenhum logo encontrado. Digite a URL manualmente."
        );
      }
    } catch (error) {
      console.error("Erro ao buscar logo:", error);
      showToast("error", "Erro ao buscar logo");
    } finally {
      setSearchingLogo(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = getToken();
      if (!token) throw new Error("Token não encontrado");

      const url = editingBrand
        ? `http://localhost:3001/api/brands/${editingBrand.id}`
        : "http://localhost:3001/api/brands";

      const method = editingBrand ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar marca");
      }

      showToast(
        "success",
        editingBrand
          ? "Marca atualizada com sucesso!"
          : "Marca criada com sucesso!"
      );
      closeModal();
      reloadBrands();
    } catch (error) {
      console.error("Erro ao salvar marca:", error);
      showToast("error", "Erro ao salvar marca");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!brandToDelete) return;

    setDeleting(true);
    try {
      const token = getToken();
      if (!token) throw new Error("Token não encontrado");

      const response = await fetch(
        `http://localhost:3001/api/brands/${brandToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao deletar marca");
      }

      showToast("success", "Marca deletada com sucesso!");
      setBrandToDelete(null);
      reloadBrands();
    } catch (error) {
      console.error("Erro ao deletar marca:", error);
      showToast("error", "Erro ao deletar marca. Tente novamente.");
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
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80')",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-2 text-white hover:text-red-100 transition-colors mr-4 bg-white/10 px-3 py-2 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </Link>
              <div className="bg-white p-2 rounded-lg mr-3">
                <AcessorautoLogo size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Gerenciar Marcas
                </h1>
                <p className="text-red-100 text-sm">
                  Adicione, edite ou remova marcas de veículos
                </p>
              </div>
            </div>

            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-white text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors font-semibold shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Nova Marca
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {brands.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhuma marca cadastrada
            </h3>
            <p className="text-gray-500 mb-6">
              Adicione sua primeira marca para começar
            </p>
            <button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg"
            >
              Adicionar Primeira Marca
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
              >
                <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                  {brand.logo_url ? (
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-4xl font-bold text-gray-300">
                      {brand.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                    {brand.name}
                  </h3>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(brand)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => setBrandToDelete(brand)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal Criar/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {editingBrand ? "Editar Marca" : "Nova Marca"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Marca *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    placeholder="Ex: Toyota, Honda, Ford..."
                  />
                  <button
                    type="button"
                    onClick={searchBrandLogo}
                    disabled={searchingLogo || !formData.name.trim()}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md whitespace-nowrap"
                    title="Buscar logo automaticamente"
                  >
                    <Wand2 className="w-4 h-4" />
                    {searchingLogo ? "..." : "Auto"}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Digite o nome e clique em "Auto" para buscar o logo
                  automaticamente
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL da Logo (opcional)
                </label>
                <input
                  type="url"
                  value={formData.logo_url}
                  onChange={(e) =>
                    setFormData({ ...formData, logo_url: e.target.value })
                  }
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="https://exemplo.com/logo.png"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Cole a URL de uma imagem ou use o botão "Auto" acima
                </p>
              </div>

              {/* Sugestões de Logos */}
              {logoSuggestions.length > 1 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-purple-900 mb-3">
                    📸 {logoSuggestions.length} logos encontrados - Escolha um:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {logoSuggestions.map((logoUrl, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, logo_url: logoUrl })
                        }
                        className={`relative bg-white rounded-lg p-3 border-2 transition-all duration-200 hover:shadow-md ${
                          formData.logo_url === logoUrl
                            ? "border-purple-600 shadow-md"
                            : "border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        <div className="h-16 flex items-center justify-center">
                          <img
                            src={logoUrl}
                            alt={`Logo ${index + 1}`}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Ctext x='50%25' y='50%25' font-size='40' text-anchor='middle' dy='.3em'%3E❌%3C/text%3E%3C/svg%3E";
                            }}
                          />
                        </div>
                        {formData.logo_url === logoUrl && (
                          <div className="absolute top-1 right-1 bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            ✓
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {formData.logo_url && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Pré-visualização:
                  </p>
                  <div className="bg-white rounded-lg p-4 flex items-center justify-center h-24">
                    <img
                      src={formData.logo_url}
                      alt="Preview"
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200 shadow-lg"
                >
                  {submitting
                    ? "Salvando..."
                    : editingBrand
                    ? "Atualizar"
                    : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Exclusão */}
      {brandToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Excluir Marca
              </h3>
              <p className="text-gray-500 mb-6">
                Tem certeza que deseja excluir a marca{" "}
                <strong>{brandToDelete.name}</strong>? Esta ação não pode ser
                desfeita.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setBrandToDelete(null)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                >
                  {deleting ? "Excluindo..." : "Excluir"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
