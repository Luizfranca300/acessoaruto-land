import { useState, useEffect, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X, Plus, Sparkles } from "lucide-react";
import { getVehicle, updateVehicle, getBrands, Brand } from "../../lib/api";
import { getToken } from "../../lib/auth";
import AcessorautoLogo from "../../components/AcessorautoLogo";
import {
  formatCurrencyInput,
  parseCurrencyInput,
  formatMileageInput,
  parseMileageInput,
  formatYearInput,
} from "../../lib/masks";
import { useToast } from "../../lib/toast";

type VehicleForm = {
  brand_id: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  color: string;
  description: string;
  features: string[];
  images: string[];
  is_featured: boolean;
  is_sold: boolean;
};

// Características pré-definidas mais comuns em veículos
const COMMON_FEATURES = [
  "Ar-condicionado",
  "Direção elétrica",
  "Direção hidráulica",
  "Vidros elétricos",
  "Travas elétricas",
  "Alarme",
  "Som",
  "Multimídia",
  "Câmera de ré",
  "Sensor de estacionamento",
  "Airbag",
  "ABS",
  "Controle de tração",
  "Piloto automático",
  "Bancos em couro",
  "Rodas de liga leve",
  "Faróis de neblina",
  "Teto solar",
  "Computador de bordo",
  "Bluetooth",
];

export default function EditVehicle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [formData, setFormData] = useState<VehicleForm>({
    brand_id: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    fuel_type: "flex",
    transmission: "manual",
    color: "",
    description: "",
    features: [],
    images: [],
    is_featured: false,
    is_sold: false,
  });
  const [currentFeature, setCurrentFeature] = useState("");
  const [priceDisplay, setPriceDisplay] = useState("");
  const [mileageDisplay, setMileageDisplay] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoadingData(true);
        const [vehicleData, brandsData] = await Promise.all([
          getVehicle(id!),
          getBrands(),
        ]);

        setBrands(brandsData);

        // Preencher formulário com dados do veículo
        setFormData({
          brand_id: vehicleData.brand_id,
          model: vehicleData.model,
          year: vehicleData.year,
          price: Number(vehicleData.price),
          mileage: vehicleData.mileage,
          fuel_type: vehicleData.fuel_type,
          transmission: vehicleData.transmission,
          color: vehicleData.color,
          description: vehicleData.description || "",
          features: vehicleData.features || [],
          images: vehicleData.images || [],
          is_featured: vehicleData.is_featured,
          is_sold: vehicleData.is_sold,
        });

        // Formatar preço e quilometragem para exibição
        const price = Number(vehicleData.price);
        setPriceDisplay(formatCurrencyInput((price * 100).toString()));
        setMileageDisplay(formatMileageInput(vehicleData.mileage.toString()));
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        showToast("error", "Erro ao carregar veículo");
        navigate("/admin/vehicles");
      } finally {
        setLoadingData(false);
      }
    }

    fetchData();
  }, [id, navigate, showToast]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const token = getToken();
      if (!token) throw new Error("Token não encontrado");

      const uploadFormData = new FormData();
      Array.from(files).forEach((file) => {
        uploadFormData.append("images", file);
      });

      const response = await fetch("http://localhost:3001/upload/images", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error("Erro no upload");
      }

      const result = await response.json();
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...result.images],
      }));
    } catch (error) {
      console.error("Erro no upload:", error);
      showToast("error", "Erro ao fazer upload das imagens");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index: number) {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  async function generateAIDescription() {
    // Validar se dados mínimos foram preenchidos
    if (!formData.brand_id || !formData.model || !formData.year) {
      showToast(
        "warning",
        "Preencha marca, modelo e ano antes de gerar a descrição"
      );
      return;
    }

    setGeneratingDescription(true);
    try {
      const token = getToken();
      if (!token) throw new Error("Token não encontrado");

      // Dados para enviar à IA
      const brandName = brands.find((b) => b.id === formData.brand_id)?.name;

      const dataToSend = {
        brand: brandName,
        model: formData.model,
        year: formData.year,
        color: formData.color,
        fuel_type: formData.fuel_type,
        transmission: formData.transmission,
        mileage: formData.mileage,
        features: formData.features,
      };

      const response = await fetch(
        "http://localhost:3001/ai/generate-description",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao gerar descrição");
      }

      const result = await response.json();

      // Atualizar descrição e características sugeridas
      setFormData((prev) => ({
        ...prev,
        description: result.description || prev.description,
        features: result.features
          ? [...new Set([...prev.features, ...result.features])]
          : prev.features,
      }));

      showToast("success", "Descrição gerada com IA! ✨");
    } catch (error) {
      console.error("Erro ao gerar descrição:", error);
      showToast(
        "error",
        "Erro ao gerar descrição com IA. Tente escrever manualmente."
      );
    } finally {
      setGeneratingDescription(false);
    }
  }

  function addFeature() {
    if (currentFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()],
      }));
      setCurrentFeature("");
    }
  }

  function removeFeature(index: number) {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await updateVehicle(id!, formData);
      showToast("success", "Veículo atualizado com sucesso!");
      navigate("/admin/vehicles");
    } catch (error) {
      console.error("Erro ao atualizar veículo:", error);
      showToast("error", "Erro ao atualizar veículo");
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
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
                "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80')",
              backgroundBlendMode: "multiply",
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center py-4">
            <Link
              to="/admin/vehicles"
              className="flex items-center gap-2 text-white hover:text-red-100 transition-colors mr-4 bg-white/10 px-3 py-2 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </Link>
            <div className="bg-white p-2 rounded-lg mr-3">
              <AcessorautoLogo size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Editar Veículo</h1>
              <p className="text-red-100 text-sm">
                Atualize as informações do veículo
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Básicas */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Informações Básicas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marca *
                </label>
                <select
                  value={formData.brand_id}
                  onChange={(e) =>
                    setFormData({ ...formData, brand_id: e.target.value })
                  }
                  required
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="">Selecione uma marca</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo *
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                  required
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="Ex: Civic, Corolla, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ano *
                </label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => {
                    const formatted = formatYearInput(e.target.value);
                    if (formatted) {
                      const year = parseInt(formatted);
                      if (
                        year >= 1900 &&
                        year <= new Date().getFullYear() + 1
                      ) {
                        setFormData({ ...formData, year });
                      }
                    }
                  }}
                  required
                  maxLength={4}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="Ex: 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço (R$) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">
                    R$
                  </span>
                  <input
                    type="text"
                    value={priceDisplay}
                    onChange={(e) => {
                      const formatted = formatCurrencyInput(e.target.value);
                      setPriceDisplay(formatted);
                      setFormData({
                        ...formData,
                        price: parseCurrencyInput(formatted),
                      });
                    }}
                    required
                    className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quilometragem *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={mileageDisplay}
                    onChange={(e) => {
                      const formatted = formatMileageInput(e.target.value);
                      setMileageDisplay(formatted);
                      setFormData({
                        ...formData,
                        mileage: parseMileageInput(formatted),
                      });
                    }}
                    required
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    placeholder="Ex: 50.000"
                  />
                  <span className="absolute right-3 top-2 text-gray-400">
                    km
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor *
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  required
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="Ex: Branco, Preto, Prata"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Combustível *
                </label>
                <select
                  value={formData.fuel_type}
                  onChange={(e) =>
                    setFormData({ ...formData, fuel_type: e.target.value })
                  }
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="flex">Flex</option>
                  <option value="gasoline">Gasolina</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Elétrico</option>
                  <option value="hybrid">Híbrido</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transmissão *
                </label>
                <select
                  value={formData.transmission}
                  onChange={(e) =>
                    setFormData({ ...formData, transmission: e.target.value })
                  }
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="manual">Manual</option>
                  <option value="automatic">Automático</option>
                  <option value="cvt">CVT</option>
                </select>
              </div>
            </div>

            {/* Descrição */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <button
                  type="button"
                  onClick={generateAIDescription}
                  disabled={
                    generatingDescription ||
                    !formData.brand_id ||
                    !formData.model ||
                    !formData.year
                  }
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:opacity-60"
                  title="Gera descrição profissional com IA baseada nos dados preenchidos"
                >
                  <Sparkles className="w-4 h-4" />
                  {generatingDescription ? "Gerando..." : "Gerar com IA"}
                </button>
              </div>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="Descreva as características e condições do veículo..."
              />
              {!formData.brand_id || !formData.model || !formData.year ? (
                <p className="text-xs text-gray-500 mt-1">
                  💡 Preencha marca, modelo e ano para usar a geração com IA
                </p>
              ) : null}
            </div>
          </div>

          {/* Características */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Características
            </h2>

            {/* Características Pré-definidas */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Características Comuns
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {COMMON_FEATURES.map((feature) => {
                  const isSelected = formData.features.includes(feature);
                  return (
                    <label
                      key={feature}
                      className="flex items-center cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              features: [...formData.features, feature],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              features: formData.features.filter(
                                (f) => f !== feature
                              ),
                            });
                          }
                        }}
                        className="mr-2 rounded focus:ring-red-600 text-red-600"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        {feature}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Característica Personalizada */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Adicionar Característica Personalizada
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentFeature}
                  onChange={(e) => setCurrentFeature(e.target.value)}
                  className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="Ex: Bancos aquecidos, GPS integrado..."
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addFeature())
                  }
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Características Selecionadas */}
            {formData.features.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Características Selecionadas ({formData.features.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => {
                    const isCommon = COMMON_FEATURES.includes(feature);
                    return (
                      <span
                        key={index}
                        className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {feature}
                        {!isCommon && (
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="text-red-400 hover:text-red-600"
                            title="Remover característica personalizada"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Dica: Características comuns podem ser desmarcadas acima.
                  Personalizadas podem ser removidas aqui.
                </p>
              </div>
            )}
          </div>

          {/* Upload de Imagens */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Imagens</h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={uploading}
              />
              <label
                htmlFor="image-upload"
                className={`cursor-pointer ${uploading ? "opacity-50" : ""}`}
              >
                <Upload className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <p className="text-gray-700 text-lg mb-2">
                  {uploading
                    ? "Fazendo upload..."
                    : "Clique para selecionar imagens"}
                </p>
                <p className="text-gray-500 text-sm">
                  Máximo 10 imagens, até 10MB cada
                </p>
              </label>
            </div>

            {formData.images.length > 0 && (
              <div className="mt-6">
                <h3 className="text-gray-900 font-medium mb-4">
                  Imagens Carregadas ({formData.images.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Opções */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Opções</h2>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) =>
                    setFormData({ ...formData, is_featured: e.target.checked })
                  }
                  className="mr-3 rounded focus:ring-red-600 text-red-600"
                />
                <span className="text-gray-700">Veículo em destaque</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_sold}
                  onChange={(e) =>
                    setFormData({ ...formData, is_sold: e.target.checked })
                  }
                  className="mr-3 rounded focus:ring-red-600 text-red-600"
                />
                <span className="text-gray-700">Veículo vendido</span>
              </label>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4">
            <Link
              to="/admin/vehicles"
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors text-center"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 shadow-lg"
            >
              {loading ? "Salvando..." : "Atualizar Veículo"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
